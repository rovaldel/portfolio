import { documentLocale, getUi } from '../lib/i18n';

const t = getUi(documentLocale());

const controller = new AbortController();

// On narrow screens the section chips become one scrollable row; centre the
// chosen one horizontally without moving the page vertically.
const revealChip = (chip: Element) => {
  const row = chip.parentElement;
  if (!row || row.scrollWidth <= row.clientWidth) return;
  const rowBox = row.getBoundingClientRect();
  const chipBox = chip.getBoundingClientRect();
  row.scrollLeft += chipBox.left - rowBox.left - (rowBox.width - chipBox.width) / 2;
};

const currentChip = document.querySelector('[data-actions] [aria-current]');
if (currentChip) revealChip(currentChip);

document.querySelectorAll<HTMLAnchorElement>('[data-portfolio-action]').forEach((action) => {
  action.addEventListener(
    'click',
    (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const chips = action.closest('[data-actions]');
      if (chips) {
        chips.querySelectorAll('[aria-current]').forEach((chip) => chip.removeAttribute('aria-current'));
        action.setAttribute('aria-current', 'true');
        window.requestAnimationFrame(() => revealChip(action));
      }
      window.dispatchEvent(
        new CustomEvent('portfolio:action', {
          detail: {
            label: action.textContent?.trim() ?? t.query.sectionFallback,
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
