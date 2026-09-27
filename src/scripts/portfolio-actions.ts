export {};

const controller = new AbortController();

document.querySelectorAll<HTMLAnchorElement>('[data-portfolio-action]').forEach((action) => {
  action.addEventListener(
    'click',
    (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent('portfolio:action', {
          detail: {
            label: action.textContent?.trim() ?? 'Sección del portfolio',
            response: action.dataset['response'] ?? '',
            destination: action.href,
            kind: action.dataset['responseKind'],
          },
        }),
      );
    },
    { signal: controller.signal },
  );
});

window.addEventListener('pagehide', () => controller.abort(), { once: true });
