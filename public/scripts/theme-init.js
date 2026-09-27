(function () {
  const validThemes = new Set(['light', 'dark', 'cobalto', 'rioja', 'bosque']);
  let theme = 'rioja';
  try {
    const saved = localStorage.getItem('rv_theme');
    if (saved && validThemes.has(saved)) theme = saved;
  } catch {}
  document.documentElement.dataset.theme = theme;
})();
