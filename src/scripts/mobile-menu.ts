export {};

const controller = new AbortController();
const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
const trigger = menu?.querySelector<HTMLElement>('summary');

if (menu && trigger) {
  const close = (restoreFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) trigger.focus();
  };

  document.addEventListener(
    'click',
    (event) => {
      if (event.target instanceof Node && !menu.contains(event.target)) close();
    },
    { signal: controller.signal },
  );
  menu.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close(true);
    },
    { signal: controller.signal },
  );
  menu.addEventListener(
    'click',
    (event) => {
      if (event.target instanceof Element && event.target.closest('a')) close();
    },
    { signal: controller.signal },
  );
  // Crossing to the desktop layout hides the trigger, so never leave the panel open.
  window.matchMedia('(min-width: 561px)').addEventListener('change', () => close(), {
    signal: controller.signal,
  });
}

window.addEventListener('pagehide', () => controller.abort(), { once: true });
