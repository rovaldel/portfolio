# Scripts JavaScript - Documentación

## 📁 Estructura de Scripts

Los scripts JavaScript están organizados en la carpeta `js/` para mantener el código modular y fácil de mantener.

### Librerías Externas

- `jquery.min.js` - jQuery 3.x
- `jquery-migrate-3.0.1.min.js` - Compatibilidad de jQuery
- `popper.min.js` - Popper.js (para tooltips y popovers)
- `bootstrap.min.js` - Bootstrap 4 (framework CSS)
- `jquery.easing.1.3.js` - Efectos de easing para animaciones
- `jquery.waypoints.min.js` - Scroll triggers
- `jquery.stellar.min.js` - Efecto parallax
- `owl.carousel.min.js` - Carrusel de imágenes
- `jquery.magnific-popup.min.js` - Lightbox de imágenes
- `aos.js` - Animate on Scroll (animaciones al scroll)
- `jquery.animateNumber.min.js` - Animación de números
- `scrollax.min.js` - Efecto parallax avanzado

### Scripts Personalizados

#### `main.js`
- Script principal del sitio
- Inicializaciones globales
- Lógica de navegación y secciones

#### `contact-form.js`
- **Propósito**: Manejo del formulario de contacto
- **Funcionalidad**:
  - Validación de campos (nombre, email, mensaje)
  - Envío POST a webhook n8n: `https://n8n.rodrigovaldelvira.com/webhook/portfolio-sendemail`
  - Notificaciones flotantes (banner azul #3e64ff)
  - Animaciones de entrada/salida
- **Dependencias**: Formulario con id `contact-form-n8n`

#### `chatbot-config.js`
- **Propósito**: Configuración global del chatbot
- **Funcionalidad**:
  - Define variable global `PORTFOLIO_CHATBOT_WEBHOOK`
  - URL del webhook de n8n para preguntas/respuestas
- **Uso**: Referenciado por `js/chatbot.js`

#### `cookie-manager.js`
- **Propósito**: Gestión de cookies y Google Analytics
- **Funcionalidad**:
  - Banner de aceptación de cookies
  - Almacenamiento de preferencias en localStorage
  - Carga condicional de Google Analytics basada en consentimiento
  - Manejo de tres opciones: "Aceptar Todo", "Solo Necesarias", "Rechazar"
- **Configuración**: 
  - Reemplazar `GA_ID = 'G-XXXXXXXXXX'` con tu ID de Google Analytics
  - ID obtenido en: Google Analytics → Configuración → Información de propiedad
- **Métodos públicos**:
  - `CookieManager.getConsent()` - Obtener preferencias guardadas
  - `CookieManager.setConsent(analytics, necessary)` - Guardar preferencias
  - `CookieManager.showBanner()` - Mostrar banner
  - `CookieManager.hideBanner()` - Ocultar banner

#### `footer-year.js`
- **Propósito**: Mostrar año actual en footer
- **Funcionalidad**:
  - Actualiza automáticamente el año en el copyright
  - Se ejecuta al cargar el DOM

#### `chatbot.js` (ya existente)
- Script del asistente virtual
- Integración con marked.js y DOMPurify para renderizar Markdown
- Comunicación con webhook n8n

### Librerías Externas (CDN)

```html
<!-- Markdown rendering -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<!-- HTML sanitization -->
<script src="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"></script>
```

## 🔧 Configuración Requerida

### Google Analytics (IMPORTANTE)

1. Abre `js/cookie-manager.js`
2. Busca: `const GA_ID = 'G-XXXXXXXXXX';`
3. Reemplázalo con tu ID real

Obtener tu ID:
- Ve a [Google Analytics](https://analytics.google.com/)
- Selecciona tu propiedad
- Configuración → Información de propiedad
- Copia el "ID de medición"

## 🧪 Testing

### Test 1: Formulario de contacto
```bash
1. Abre el sitio
2. Desplázate a la sección "Contacto"
3. Rellena nombre, email y mensaje
4. Haz clic en "Enviar"
5. Deberías ver notificación azul
```

### Test 2: Banner de cookies
```bash
1. Abre en navegador privado/incógnito
2. El banner debe aparecer en la parte inferior
3. Prueba los tres botones:
   - "Aceptar Todo" → GA se carga
   - "Solo Necesarias" → GA NO se carga
   - "Rechazar" → GA NO se carga
```

### Test 3: Año en footer
```bash
1. Desplázate al footer
2. Verifica que muestre el año actual
3. Año debe actualizarse automáticamente cada enero
```

## 📊 Orden de Carga (importante)

En `index.html`, los scripts deben cargarse en este orden:

1. Librerías jQuery y Bootstrap (líneas 971-979)
2. Efectos y plugins jQuery (líneas 980-982)
3. `main.js` - lógica principal
4. `contact-form.js` - formulario de contacto
5. `chatbot-config.js` - configuración del chatbot
6. `cookie-manager.js` - cookies y GA
7. CDN marcado y DOMPurify
8. `chatbot.js` - asistente virtual
9. `footer-year.js` - año en footer

## 🔒 Privacidad y Seguridad

- ✅ Google Analytics solo se carga si usuario acepta
- ✅ localStorage para almacenar preferencias (sin cookies HTTP)
- ✅ IP anonimizada en GA
- ✅ DOMPurify sanitiza HTML de Markdown
- ✅ Validación de campos en formulario de contacto

## 📝 Notas Adicionales

- Todos los scripts tienen comentarios JSDoc
- El código usa IIFE (Immediately Invoked Function Expression) donde es apropiado
- Los errores de fetch se capturan y notifican al usuario
- El banner de cookies persiste en localStorage hasta limpiar caché

---

**Última actualización**: 10 de noviembre de 2025
