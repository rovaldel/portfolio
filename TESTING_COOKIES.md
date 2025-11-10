<!-- 
GUÍA RÁPIDA DE TESTING DEL BANNER DE COOKIES

Copiar y pegar los comandos en la consola del navegador (F12 > Console)
para probar el sistema de cookies.
-->

<!-- TEST 1: VER CONSENTIMIENTO ACTUAL -->
localStorage.getItem('cookieConsent')
// Si es null = primera visita (banner debe aparecer)
// Si es un objeto = ya aceptó (banner no debe aparecer)

<!-- TEST 2: LIMPIAR COOKIES PARA VOLVER AL INICIO -->
localStorage.clear()
// Luego recarga: Ctrl+F5 (o Cmd+Shift+R en Mac)

<!-- TEST 3: SIMULAR ACEPTAR TODO MANUALMENTE -->
localStorage.setItem('cookieConsent', JSON.stringify({
  analytics: true,
  necessary: true,
  timestamp: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString()
}))
// Recarga y verifica que el banner NO aparece

<!-- TEST 4: SIMULAR SOLO NECESARIAS MANUALMENTE -->
localStorage.clear()
localStorage.setItem('cookieConsent', JSON.stringify({
  analytics: false,
  necessary: true,
  timestamp: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString()
}))
// Recarga y verifica que GA no se carga (pero sitio funciona)

<!-- TEST 5: VER DATOS GUARDADOS EN FORMATO LEGIBLE -->
console.table(JSON.parse(localStorage.getItem('cookieConsent')))

<!-- TEST 6: VERIFICAR GOOGLE ANALYTICS -->
// Si analytics=true, deberías ver en Network > Scripts:
// gtag/js?id=G-XXXXX (cargado desde Google)

// Si analytics=false, NO debería aparecer ese script

<!-- TEST 7: FORZAR MOSTRAR BANNER AUNQUE HAYA CONSENTIMIENTO -->
document.getElementById('cookie-banner').style.display = 'flex'

<!-- TEST 8: FORZAR OCULTAR BANNER -->
CookieManager.hideBanner()

<!-- TEST 9: VER LOGS EN CONSOLA -->
// Cuando abres el sitio, deberías ver mensajes como:
// "📋 Banner de cookies mostrado (primera visita)"
// o
// "✓ Consentimiento encontrado en localStorage, banner oculto"

<!-- TEST 10: REVISAR TIMESTAMPS -->
var consent = JSON.parse(localStorage.getItem('cookieConsent'))
console.log('Guardado:', new Date(consent.timestamp))
console.log('Expira:', new Date(consent.expiresAt))
