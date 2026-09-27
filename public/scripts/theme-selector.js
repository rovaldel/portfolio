const themeIds = new Set(['light', 'dark', 'cobalto', 'rioja', 'bosque']);

document.querySelectorAll('[data-theme-selector]').forEach((selector) => {
  const trigger = selector.querySelector('[data-theme-trigger]');
  const menu = selector.querySelector('[data-theme-menu]');
  const options = Array.from(selector.querySelectorAll('[data-theme-id]'));
  if (!trigger || !menu) return;

  const activeTheme = () =>
    themeIds.has(document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : 'rioja';
  const sync = () => {
    const current = activeTheme();
    options.forEach((option) => {
      const selected = option.dataset.themeId === current;
      option.setAttribute('aria-pressed', String(selected));
      option.setAttribute('aria-current', selected ? 'true' : 'false');
    });
  };
  const close = (restoreFocus = false) => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  };
  const open = () => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    sync();
    options.find((option) => option.dataset.themeId === activeTheme())?.focus();
  };

  sync();
  trigger.addEventListener('click', () => (menu.hidden ? open() : close()));
  options.forEach((option) => {
    option.addEventListener('click', () => {
      const theme = option.dataset.themeId;
      if (!theme || !themeIds.has(theme)) return;
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem('rv_theme', theme);
      } catch {
        // Storage is an enhancement, not a dependency.
      }
      sync();
      close(true);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) close(true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !selector.contains(event.target)) {
      event.preventDefault();
      close(true);
    }
  });
});
