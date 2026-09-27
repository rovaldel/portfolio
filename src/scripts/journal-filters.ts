const controller = new AbortController();
const search = document.querySelector<HTMLInputElement>('[data-journal-search]');
const empty = document.querySelector<HTMLElement>('[data-journal-empty]');
const entries = [...document.querySelectorAll<HTMLElement>('[data-journal-entry]')];
const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-journal-filter]')];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-ES')
    .replace(/\s+/g, ' ')
    .trim();

let activeCategory = 'all';

const applyFilters = () => {
  const query = normalize(search?.value ?? '');
  let visibleCount = 0;

  for (const entry of entries) {
    const categoryMatches = activeCategory === 'all' || entry.dataset['category'] === activeCategory;
    const queryMatches = !query || normalize(entry.textContent ?? '').includes(query);
    entry.hidden = !categoryMatches || !queryMatches;
    if (!entry.hidden) visibleCount += 1;
  }

  if (empty) empty.hidden = visibleCount > 0;
};

for (const filter of filters) {
  filter.addEventListener(
    'click',
    () => {
      activeCategory = filter.dataset['journalFilter'] ?? 'all';
      for (const item of filters) {
        item.setAttribute('aria-pressed', String(item === filter));
      }
      applyFilters();
    },
    { signal: controller.signal },
  );
}

search?.addEventListener('input', applyFilters, { signal: controller.signal });
applyFilters();
window.addEventListener('pagehide', () => controller.abort(), { once: true });
