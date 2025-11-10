/**
 * Manejo del formulario de contacto
 * Envía los datos a n8n webhook y muestra notificaciones
 */
(function(){
  var form = document.getElementById('contact-form-n8n');
  if(!form) return;

  /**
   * Mostrar banner de notificación flotante
   * @param {string} message - Mensaje a mostrar
   * @param {boolean} isSuccess - Si es éxito (no se usa, pero mantener para compatibilidad)
   */
  function showBanner(message, isSuccess) {
    var banner = document.createElement('div');
    banner.className = 'contact-banner';
    banner.textContent = message;
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background-color: #3e64ff;
      color: white;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(62, 100, 255, 0.3);
      z-index: 9999;
      animation: slideInBanner 0.4s ease-out, slideOutBanner 0.4s ease-out 3s forwards;
    `;

    document.body.appendChild(banner);

    setTimeout(function(){
      banner.remove();
    }, 3400);
  }

  // Agregar animaciones CSS si no existen
  var style = document.createElement('style');
  style.textContent = `
    @keyframes slideInBanner {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutBanner {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  /**
   * Manejador del envío del formulario
   */
  form.addEventListener('submit', async function(e){
    e.preventDefault();

    // Obtener valores del formulario
    var nombre = form.querySelector('input[name="nombre"]').value.trim();
    var email = form.querySelector('input[name="email"]').value.trim();
    var asunto = form.querySelector('input[name="asunto"]').value.trim() || 'Contacto desde la web';
    var mensaje = form.querySelector('textarea[name="mensaje"]').value.trim();

    // Validar campos requeridos
    if(!nombre || !email || !mensaje){
      showBanner('Por favor rellena nombre, email y mensaje.', false);
      return;
    }

    var submitBtn = form.querySelector('input[type="submit"]');
    if(submitBtn) submitBtn.disabled = true;

    try {
      // Enviar a webhook n8n
      var resp = await fetch('https://n8n.rodrigovaldelvira.com/webhook/portfolio-sendemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nombre, 
          email: email, 
          asunto: asunto, 
          mensaje: mensaje 
        })
      });

      if(resp.ok){
        showBanner('Mensaje enviado correctamente. Gracias.', true);
        form.reset();
      } else {
        showBanner('Error al enviar. Intenta de nuevo.', false);
        console.error('Error:', resp.status);
      }
    } catch(err) {
      showBanner('Error de conexión. Intenta más tarde.', false);
      console.error('Fetch error:', err);
    } finally {
      if(submitBtn) submitBtn.disabled = false;
    }
  });
})();
