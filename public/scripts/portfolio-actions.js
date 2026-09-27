document.querySelectorAll('[data-portfolio-action]').forEach((action) => {
  action.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const answer = action.closest('[data-actions]')?.parentElement?.querySelector('[data-action-answer]');
    if (!answer) return;
    answer.replaceChildren();
    answer.hidden = false;
    const paragraph = document.createElement('p');
    paragraph.textContent = action.dataset.response || '';
    const link = document.createElement('a');
    link.href = action.href;
    link.textContent = `Abrir ${action.textContent.trim() || 'la sección'}`;
    answer.append(paragraph, link);
    answer.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  });
});
