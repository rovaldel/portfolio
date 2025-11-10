/**
 * Gestión de cookies y Google Analytics
 * Maneja el consentimiento de cookies y la carga condicional de Google Analytics
 * 
 * El banner de cookies solo aparece la PRIMERA VEZ que el usuario visita el sitio.
 * Una vez que acepta/rechaza, las preferencias se guardan en localStorage y el
 * banner no volverá a aparecer a menos que limpie la caché del navegador.
 */
const CookieManager = {
  // Clave de almacenamiento local
  STORAGE_KEY: 'cookieConsent',

  /**
   * Obtener consentimiento de cookies del localStorage
   * @returns {object|null} - Objeto con preferencias guardadas o null si no existen
   */
  getConsent: function() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
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
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 año
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    return consent;
  },

  /**
   * Mostrar banner de cookies SOLO si no hay consentimiento previo
   * Si el usuario ya tomó una decisión anteriormente, el banner NO aparecerá
   */
  showBanner: function() {
    const banner = document.getElementById('cookie-banner');
    const hasConsent = this.getConsent();
    
    if (banner) {
      // Banner solo aparece si NO hay consentimiento guardado
      if (!hasConsent) {
        banner.style.display = 'flex';
        console.log('📋 Banner de cookies mostrado (primera visita)');
      } else {
        banner.style.display = 'none';
        console.log('✓ Consentimiento encontrado en localStorage, banner oculto');
      }
    }
  },

  /**
   * Ocultar banner con animación de desvanecimiento
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
    if (!analyticsConsent) {
      console.log('📊 Google Analytics: Deshabilitado (usuario rechazó)');
      return;
    }

    // ⚠️ IMPORTANTE: Reemplazar con tu propio ID de Google Analytics
    // Obtenerlo en: Google Analytics → Configuración → Información de propiedad
    const GA_ID = 'G-XXXXXXXXXX';

    if (GA_ID === 'G-XXXXXXXXXX') {
      console.warn('⚠️ Google Analytics: Reemplaza GA_ID con tu ID real en js/cookie-manager.js');
      return;
    }

    // Cargar script de Google Analytics
    const script = document.getElementById('ga-script');
    if (!script) {
      console.error('❌ Elemento ga-script no encontrado');
      return;
    }

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
 * El banner solo aparece en la primera visita (sin consentimiento previo)
 */
document.addEventListener('DOMContentLoaded', function() {
  // Mostrar banner de cookies si es la primera visita (sin consentimiento previo)
  CookieManager.showBanner();

  // Botón: Aceptar Todo (Google Analytics + cookies necesarias)
  const acceptBtn = document.getElementById('cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      CookieManager.setConsent(true, true);
      CookieManager.initAnalytics(true);
      CookieManager.hideBanner();
      console.log('✅ Cookies aceptadas (todas) - Guardado en localStorage por 1 año');
    });
  }

  // Botón: Solo Necesarias (sin Google Analytics)
  const necessaryBtn = document.getElementById('cookie-necessary');
  if (necessaryBtn) {
    necessaryBtn.addEventListener('click', function() {
      CookieManager.setConsent(false, true);
      CookieManager.initAnalytics(false);
      CookieManager.hideBanner();
      console.log('✅ Solo cookies necesarias - Guardado en localStorage por 1 año');
    });
  }

  // Botón: Rechazar (sin Google Analytics)
  const rejectBtn = document.getElementById('cookie-reject');
  if (rejectBtn) {
    rejectBtn.addEventListener('click', function() {
      CookieManager.setConsent(false, true);
      CookieManager.initAnalytics(false);
      CookieManager.hideBanner();
      console.log('✅ Cookies rechazadas - Guardado en localStorage por 1 año');
    });
  }

  // Log para debug: mostrar consentimiento actual
  const currentConsent = CookieManager.getConsent();
  if (currentConsent) {
    console.log('📋 Consentimiento actual:', currentConsent);
  }
});
