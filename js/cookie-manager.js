/**
 * Gestión de cookies y Google Analytics
 * Maneja el consentimiento de cookies y la carga condicional de Google Analytics
 */
const CookieManager = {
  /**
   * Obtener consentimiento de cookies del localStorage
   * @returns {object|null} - Objeto con preferencias o null
   */
  getConsent: function() {
    const stored = localStorage.getItem('cookieConsent');
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Guardar consentimiento de cookies en localStorage
   * @param {boolean} analytics - Si se aceptan cookies de analítica
   * @param {boolean} necessary - Si se aceptan cookies necesarias (siempre true)
   * @returns {object} - Objeto guardado
   */
  setConsent: function(analytics = false, necessary = true) {
    const consent = {
      analytics: analytics,
      necessary: necessary,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    return consent;
  },

  /**
   * Mostrar banner de cookies si no hay consentimiento previo
   */
  showBanner: function() {
    const banner = document.getElementById('cookie-banner');
    if (banner && !this.getConsent()) {
      banner.style.display = 'flex';
    }
  },

  /**
   * Ocultar banner con animación
   */
  hideBanner: function() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.opacity = '0';
      setTimeout(() => {
        banner.style.display = 'none';
      }, 300);
    }
  },

  /**
   * Inicializar Google Analytics si el usuario acepta
   * @param {boolean} analyticsConsent - Si se permite cargar Google Analytics
   */
  initAnalytics: function(analyticsConsent = false) {
    if (!analyticsConsent) return;

    // ⚠️ IMPORTANTE: Reemplazar con tu propio ID de Google Analytics
    // Obtenerlo en: Google Analytics → Configuración → Información de propiedad
    const GA_ID = 'G-XXXXXXXXXX';

    if (GA_ID === 'G-XXXXXXXXXX') {
      console.warn('⚠️ Google Analytics: Reemplaza GA_ID con tu ID real en js/cookie-manager.js');
      return;
    }

    // Cargar script de Google Analytics
    const script = document.getElementById('ga-script');
    if (!script) return;

    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    // Inicializar gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      'anonymize_ip': true,
      'allow_google_signals': analyticsConsent,
      'allow_ad_personalization_signals': false
    });

    // Registrar estado de consentimiento
    gtag('consent', 'update', {
      'analytics_storage': analyticsConsent ? 'granted' : 'denied'
    });

    console.log('✓ Google Analytics cargado con ID:', GA_ID);
  }
};

/**
 * Inicializar manejadores de botones del banner al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
  // Mostrar banner si no hay consentimiento previo
  CookieManager.showBanner();

  // Botón: Aceptar Todo
  const acceptBtn = document.getElementById('cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      CookieManager.setConsent(true, true);
      CookieManager.initAnalytics(true);
      CookieManager.hideBanner();
      console.log('✓ Cookies aceptadas (todas)');
    });
  }

  // Botón: Solo Necesarias
  const necessaryBtn = document.getElementById('cookie-necessary');
  if (necessaryBtn) {
    necessaryBtn.addEventListener('click', function() {
      CookieManager.setConsent(false, true);
      CookieManager.initAnalytics(false);
      CookieManager.hideBanner();
      console.log('✓ Solo cookies necesarias');
    });
  }

  // Botón: Rechazar
  const rejectBtn = document.getElementById('cookie-reject');
  if (rejectBtn) {
    rejectBtn.addEventListener('click', function() {
      CookieManager.setConsent(false, true);
      CookieManager.initAnalytics(false);
      CookieManager.hideBanner();
      console.log('✓ Cookies rechazadas');
    });
  }
});
