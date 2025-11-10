# Sistema de Gestión de Cookies - Guía Completa

## 🍪 ¿Cómo Funciona?

El banner de cookies **solo aparece la PRIMERA VEZ** que un usuario visita tu sitio web. Una vez que acepta o rechaza las cookies, su preferencia se **guarda en el navegador (localStorage)** y el banner **no volverá a aparecer**.

## 🔄 Flujo de Funcionamiento

### Primera Visita (Sin Historial)
```
Usuario abre el sitio
         ↓
¿Hay consentimiento guardado en localStorage?
         ↓ NO
    Mostrar banner
         ↓
Usuario elige opción:
  ├─ "Aceptar Todo" → Guardar preferencia + Cargar GA
  ├─ "Solo Necesarias" → Guardar preferencia (sin GA)
  └─ "Rechazar" → Guardar preferencia (sin GA)
         ↓
Ocultar banner
```

### Visitas Posteriores
```
Usuario abre el sitio
         ↓
¿Hay consentimiento guardado en localStorage?
         ↓ SÍ
    Banner NO se muestra ✓
         ↓
Cargar Google Analytics (si aceptó)
```

## 💾 Datos Guardados en localStorage

Cuando el usuario toma una decisión, se guarda esto en `localStorage`:

```json
{
  "cookieConsent": {
    "analytics": true/false,
    "necessary": true,
    "timestamp": "2025-11-10T15:30:00.000Z",
    "expiresAt": "2026-11-10T15:30:00.000Z"
  }
}
```

### Explicación:
- **analytics**: `true` si acepta Google Analytics, `false` si rechaza
- **necessary**: Siempre `true` (cookies esenciales del sitio)
- **timestamp**: Cuándo tomó la decisión
- **expiresAt**: Válido por 1 año desde la aceptación

## 🧪 Cómo Probar

### Test 1: Primera Visita
```bash
1. Abre el navegador en modo incógnito (sin historial)
2. Ve a tu sitio web
3. Deberías ver el banner de cookies en la parte inferior
4. Haz clic en "Aceptar Todo"
5. El banner desaparece
6. Abre DevTools (F12) → Console
7. Deberías ver: "✅ Cookies aceptadas (todas)"
```

### Test 2: Visitas Posteriores
```bash
1. Recarga la página (F5)
2. El banner NO debe aparecer
3. En Console: "✓ Consentimiento encontrado en localStorage"
4. Google Analytics debe estar cargado
```

### Test 3: Limpiar Cookies y Volver a Probar
```bash
1. Abre DevTools (F12) → Console
2. Escribe: localStorage.clear()
3. Presiona Enter
4. Recarga la página (F5)
5. El banner debe reaparecer (primera visita nuevamente)
```

### Test 4: Cambiar de Opción
```bash
1. En Console: localStorage.getItem('cookieConsent')
2. Deberías ver el objeto guardado
3. localStorage.clear() para limpiar
4. Recarga y elige "Solo Necesarias"
5. En Console: localStorage.getItem('cookieConsent')
6. Verificar que "analytics": false
```

## 📊 Integración con Google Analytics

### Si Usuario Acepta Todo
```javascript
✅ Google Analytics se carga
✅ IP anonimizada
✅ Sin personalización de anuncios
```

### Si Usuario Rechaza o Solo Necesarias
```javascript
❌ Google Analytics NO se carga
❌ Sin seguimiento de usuario
✅ Sitio funciona normalmente
```

## 🔧 Métodos Disponibles

### `CookieManager.getConsent()`
```javascript
// Obtiene las preferencias guardadas
const consent = CookieManager.getConsent();
// Retorna: {analytics: true/false, necessary: true, ...} o null
```

### `CookieManager.setConsent(analytics, necessary)`
```javascript
// Guarda nuevas preferencias
CookieManager.setConsent(true, true); // Aceptar todo
CookieManager.setConsent(false, true); // Solo necesarias
```

### `CookieManager.showBanner()`
```javascript
// Muestra el banner si no hay consentimiento
CookieManager.showBanner();
```

### `CookieManager.hideBanner()`
```javascript
// Oculta el banner con animación
CookieManager.hideBanner();
```

### `CookieManager.initAnalytics(boolean)`
```javascript
// Carga Google Analytics si es true
CookieManager.initAnalytics(true); // Cargar GA
CookieManager.initAnalytics(false); // No cargar GA
```

## 📱 Ubicación del Banner

- **Desktop**: En la parte inferior del sitio, ocupando el ancho completo
- **Mobile**: Igual que desktop, pero con botones apilados verticalmente

## 🎨 Personalización

### Cambiar Textos del Banner

Edita `/home/rodrigo/Rodrigo/rodrigovaldelvira/index.html` línea ~31:

```html
<div class="cookie-text">
  TU TEXTO AQUÍ...
</div>
```

### Cambiar Colores

Edita `/home/rodrigo/Rodrigo/rodrigovaldelvira/css/cookie-banner.css`:

```css
.cookie-banner {
  background: linear-gradient(135deg, #TU-COLOR1 0%, #TU-COLOR2 100%);
}
```

### Cambiar Duración de Expiración

Edita `js/cookie-manager.js`, método `setConsent()`:

```javascript
expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 365 días
// Cambiar 365 por otro número de días
```

## 🔐 Privacidad y Seguridad

- ✅ localStorage es seguro para guardar preferencias
- ✅ No se usan cookies HTTP (más privado)
- ✅ IP anonimizada en Google Analytics
- ✅ Sin personalización de anuncios
- ✅ Cumple con GDPR

## 🚨 Problemas Comunes

### El banner sigue apareciendo después de aceptar
**Solución**: Limpia la caché del navegador o usa modo incógnito

### Google Analytics no se carga
**Solución**: Verifica que hayas actualizado `GA_ID` en `js/cookie-manager.js`

### El banner no desaparece al hacer clic
**Solución**: Abre DevTools (F12) y revisa la consola por errores JavaScript

## 📝 Archivos Relacionados

- `js/cookie-manager.js` - Lógica principal
- `css/cookie-banner.css` - Estilos del banner
- `index.html` - Banner HTML (líneas ~31-40)

## 🔄 Flujo Detallado de localStorage

```javascript
// PRIMERA VISITA
localStorage.getItem('cookieConsent') // null
→ showBanner() → banner aparece

// USUARIO ACEPTA
CookieManager.setConsent(true, true)
→ localStorage.setItem('cookieConsent', {...})

// SIGUIENTE VISITA
localStorage.getItem('cookieConsent') // {analytics: true, ...}
→ showBanner() verificar → banner NO aparece
```

---

**Resumen**: El banner aparece **una sola vez** porque la decisión se guarda en localStorage. Es simple, efectivo y respeta la privacidad del usuario. 🍪✓

