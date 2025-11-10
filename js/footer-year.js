/**
 * Utilidad para mostrar el año actual en el footer
 * Actualiza automáticamente el año en la sección de copyright
 */
document.addEventListener('DOMContentLoaded', function() {
  const currentYear = new Date().getFullYear();
  const footerYearElement = document.getElementById('footer-year');
  
  if (footerYearElement) {
    footerYearElement.textContent = currentYear;
  }
});
