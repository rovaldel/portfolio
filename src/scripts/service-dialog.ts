export {};

const dialog = document.querySelector<HTMLElement>('[data-service-dialog]');
const backdrop = dialog?.parentElement;
const closeLink = dialog?.querySelector<HTMLAnchorElement>('.modal-close');

if (dialog && backdrop && closeLink) {
  const getFocusable = () =>
    Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((item) => !item.hidden);

  closeLink.focus();
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLink.click();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = getFocusable();
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeLink.click();
  });
}
