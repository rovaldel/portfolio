export {};

const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[data-project-dialog]'));
for (const dialog of dialogs) {
  const backdrop = dialog.parentElement;
  const closeLink = dialog.querySelector<HTMLAnchorElement>('.modal-close');
  if (!backdrop || !closeLink) continue;

  const focusable = () =>
    Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden);
  closeLink.focus();

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLink.click();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
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
