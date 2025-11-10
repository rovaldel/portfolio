# Configuración de Cookies y Google Analytics

## 📋 Resumen

He implementado un banner de aceptación de cookies con tres opciones y integración de Google Analytics con consentimiento condicional.

## 🍪 Funcionalidades Implementadas

### 1. Banner de Cookies
- **Ubicación**: Barra fija en la parte inferior del sitio
- **Colores**: Gradiente azul (#3e64ff → #2a4cbf) con tema blanco
- **Botones**:
  - ✅ **Aceptar Todo**: Acepta cookies analíticas y necesarias
  - 🔲 **Solo Necesarias**: Solo cookies de funcionamiento esencial
  - ❌ **Rechazar**: Rechaza cookies analíticas

### 2. Almacenamiento de Consentimiento
- Las preferencias se guardan en `localStorage` bajo la clave `cookieConsent`
- Formato: 
  ```json
  {
    "analytics": true/false,
    "necessary": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- El banner no reaparece una vez que el usuario elige una opción (hasta limpiar caché)

### 3. Google Analytics Condicional
- **Google Analytics se carga SOLO si el usuario acepta cookies analíticas**
- Implementa modo de consentimiento de Google
- Anonimización de IP habilitada
- Señales de personalización de anuncios deshabilitadas

## ⚙️ Configuración Necesaria

### Paso 1: Obtener tu ID de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad
3. Ve a **Configuración** → **Información de propiedad**
4. Copia el **ID de medición** (formato: `G-XXXXXXXXXX`)

### Paso 2: Actualizar el archivo index.html

Abre `index.html` y busca esta línea (alrededor de línea 1065):

```javascript
const GA_ID = 'G-XXXXXXXXXX'; // Cambiar a tu ID real
```

Reemplázala con tu ID real:

```javascript
const GA_ID = 'G-ABC123DEF45'; // Tu ID aquí
```

### Paso 3: Verificar en Google Analytics

1. Actualiza tu sitio en el navegador (limpiar caché)
2. Haz clic en "Aceptar Todo"
3. Abre las DevTools (F12) → Consola
4. Deberías ver: `✓ Cookies aceptadas (todas)`
5. En Google Analytics, la actividad en tiempo real debería mostrar tu sesión en unos minutos

## 🧪 Testing

### Test 1: Primera visita (sin consentimiento)
1. Abre el sitio en modo incógnito
2. Deberías ver el banner en la parte inferior
3. Google Analytics NO se carga

### Test 2: Aceptar Todo
1. Haz clic en "Aceptar Todo"
2. El banner desaparece con animación
3. Google Analytics se carga
4. localStorage contiene: `{"analytics":true,"necessary":true,...}`

### Test 3: Solo Necesarias
1. Limpia localStorage: `localStorage.clear()` en consola
2. Recarga la página
3. Haz clic en "Solo Necesarias"
4. Google Analytics NO se carga
5. localStorage contiene: `{"analytics":false,"necessary":true,...}`

### Test 4: Rechazar
1. Limpia localStorage
2. Recarga la página
3. Haz clic en "Rechazar"
4. Google Analytics NO se carga

## 📱 Responsive Design

El banner se adapta automáticamente en dispositivos móviles (<768px):
- Botones se apilan verticalmente
- Ancho completo
- Padding ajustado

## 🔐 Privacidad

- ✅ Cumple con GDPR
- ✅ Consentimiento explícito antes de Google Analytics
- ✅ IP anonimizada
- ✅ Sin señales de personalización de anuncios

## 🔧 Personalización Adicional

Si necesitas cambiar los textos del banner, edita esta sección en `index.html` (alrededor de línea 146):

```html
<!-- Banner de Cookies -->
<div id="cookie-banner" class="cookie-banner">
  <div class="cookie-text">
    Texto personalizado aquí...
  </div>
  <div class="cookie-buttons">
    <!-- Botones -->
  </div>
</div>
```

## 📚 Más Información

- [Google Analytics - Cookie Consent Mode](https://support.google.com/analytics/answer/9976101)
- [GDPR Cookie Requirements](https://gdpr-info.eu/)
- Archivo modificado: `index.html` (líneas 30-145 CSS, línea 146 HTML, línea 1050+ JavaScript)

---

**¡Configuración completada!** Una vez que añadas tu ID de Google Analytics, el sistema estará listo para producción. 🚀
