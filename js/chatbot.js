class ChatBot {
    constructor() {
        // Esperamos a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.chatButton = document.querySelector('.chat-button');
        this.chatContainer = document.querySelector('.chat-container');
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.chat-input button');
        this.closeButton = document.querySelector('.close-chat');
        this.maximizeButton = document.querySelector('.maximize-chat');
        this.typingIndicator = document.querySelector('.chat-typing');
        
        // Obtenemos la URL del webhook y aseguramos que use HTTPS
        const webhookBase = window.PORTFOLIO_CHATBOT_WEBHOOK || 'https://n8n.rodrigovaldelvira.com/webhook/portfolio-chatbot-q&A';
        this.webhookUrl = webhookBase.replace('http://', 'https://');

        // Session ID: persistimos un identificador simple en localStorage para agrupar la conversación
        try {
            const key = 'portfolio_chat_session';
            let sid = localStorage.getItem(key);
            if (!sid) {
                if (window.crypto && window.crypto.randomUUID) {
                    sid = window.crypto.randomUUID();
                } else {
                    sid = 'pv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
                }
                localStorage.setItem(key, sid);
            }
            this.sessionId = sid;
            console.log('Chat sessionId:', this.sessionId);
        } catch (e) {
            // Si localStorage no está disponible, generamos pero no persistimos
            this.sessionId = 'pv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
            console.warn('No se pudo acceder a localStorage para persistir sessionId:', e);
        }
        
        if (!this.chatButton || !this.chatContainer) {
            console.error('Chat elements not found');
            return;
        }

        // Agregamos un mensaje de bienvenida
        this.addMessage('¡Hola! ¿En qué puedo ayudarte?', 'bot');

        this.init();
    }

    init() {
        // Toggle chat on button click
        this.chatButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChat();
        });
        
        // Send message on button click
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        // Send message on Enter key
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Close chat
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.chatContainer.style.display = 'none';
            });
        }

        // Maximize / restore chat
        if (this.maximizeButton) {
            this.maximizeButton.addEventListener('click', () => {
                this.chatContainer.classList.toggle('chat-maximized');
            });
        }
    }

    toggleChat() {
        if (!this.chatContainer) return;
        
        // Comprobamos si el chat está visible verificando el estilo computado
        const computedStyle = window.getComputedStyle(this.chatContainer);
        const isVisible = computedStyle.display !== 'none';
        
        // Cambiamos la visibilidad
        this.chatContainer.style.display = isVisible ? 'none' : 'flex';
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        try {
            console.log('Enviando mensaje al webhook (original):', this.webhookUrl);

            // Mostrar indicador de escritura
            const typingEl = this.typingIndicator || document.querySelector('.chat-typing');
            if (typingEl) typingEl.style.display = 'block';

            // Aseguramos que la URL esté correctamente codificada (por ejemplo si contiene &)
            const targetUrl = encodeURI(this.webhookUrl);
            console.log('Enviando mensaje al webhook (encoded):', targetUrl);

            // Enviamos directamente al webhook con POST (incluimos sessionId para identificar la conversación)
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    timestamp: new Date().toISOString(),
                    source: 'portfolio-chat',
                    sessionId: this.sessionId,
                    page: window.location.href
                })
            });

            // Ocultar indicador de escritura
            if (typingEl) typingEl.style.display = 'none';

            console.log('Estado HTTP de la respuesta:', response.status);
            const responseText = await response.text();
            console.log('Respuesta del servidor (texto):', responseText);

            if (!response.ok) {
                console.error('Error del servidor:', response.status, responseText);
                throw new Error(`Error del servidor: ${response.status} - ${responseText}`);
            }

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.log('Respuesta no es JSON, usando texto directamente');
                responseData = { response: responseText };
            }

            console.log('Respuesta procesada:', responseData);

            // Add bot response to chat (soportamos varios nombres de campo: response, message, answer, output)
            if (responseData && (responseData.response || responseData.message || responseData.answer || responseData.output)) {
                const botResponse = responseData.response || responseData.message || responseData.answer || responseData.output;
                this.addMessage(botResponse, 'bot');
            } else {
                console.error('Respuesta sin el formato esperado:', responseData);
                throw new Error('Formato de respuesta no válido');
            }
        } catch (error) {
            console.error('Error completo:', error);
            this.addMessage('Lo siento, ha ocurrido un error al procesar tu mensaje. Detalles: ' + error.message, 'bot');
            // Intentar ayudar: mostrar posible causa de fallo
            if (error.message && error.message.includes('Failed to fetch')) {
                console.error('Posible causa: CORS o problema de red. Revisa la configuración CORS del webhook en n8n o prueba con curl desde el servidor.');
            }
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        if (type === 'bot' && window.marked) {
            try {
                // Renderizamos Markdown y sanitizamos el HTML
                const rawHtml = window.marked.parse(text || '');
                if (window.DOMPurify) {
                    messageDiv.innerHTML = window.DOMPurify.sanitize(rawHtml);
                } else {
                    messageDiv.innerHTML = rawHtml; // fallback (less safe)
                }
            } catch (e) {
                messageDiv.textContent = text;
            }
        } else {
            messageDiv.textContent = text;
        }
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});