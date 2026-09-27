export {};

const themeIds = new Set(['light', 'dark', 'cobalto', 'rioja', 'bosque']);

document.querySelectorAll<HTMLElement>('[data-theme-selector]').forEach((selector) => {
  const trigger = selector.querySelector<HTMLButtonElement>('[data-theme-trigger]');
  const menu = selector.querySelector<HTMLElement>('[data-theme-menu]');
  const options = Array.from(selector.querySelectorAll<HTMLButtonElement>('[data-theme-id]'));
  if (!trigger || !menu) return;

  const activeTheme = () =>
    themeIds.has(document.documentElement.dataset['theme'] ?? '')
      ? (document.documentElement.dataset['theme'] as string)
      : 'rioja';
  const sync = () => {
    const current = activeTheme();
    selector.dataset['currentTheme'] = current;
    options.forEach((option) => {
      const selected = option.dataset['themeId'] === current;
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
    options.find((option) => option.dataset['themeId'] === activeTheme())?.focus();
  };

  let restoreFocusAfterOutsideClick = false;
  sync();
  trigger.addEventListener('click', () => (menu.hidden ? open() : close(true)));
  options.forEach((option) => {
    option.addEventListener('click', () => {
      const theme = option.dataset['themeId'];
      if (!theme || !themeIds.has(theme)) return;
      document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem('rv_theme', theme);
      } catch {
        // The selected theme remains usable for this document.
      }
      sync();
      close(true);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) close(true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (menu.hidden || selector.contains(event.target as Node)) return;
    const target = event.target instanceof Element ? event.target : null;
    const targetControl = target?.closest('a[href], button, input, select, textarea');
    restoreFocusAfterOutsideClick = !targetControl;
    close(false);
  });
  document.addEventListener(
    'click',
    () => {
      if (!restoreFocusAfterOutsideClick) return;
      restoreFocusAfterOutsideClick = false;
      trigger.focus();
    },
    true,
  );
});
