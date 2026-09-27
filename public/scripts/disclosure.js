document.querySelectorAll('[data-disclosure]').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;
  const close = (restoreFocus = false) => {
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    if (restoreFocus) button.focus();
  };
  const open = () => {
    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  };
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-expanded') === 'true') close();
    else open();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') close(true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (
      button.getAttribute('aria-expanded') === 'true' &&
      !button.contains(event.target) &&
      !panel.contains(event.target)
    )
      close(true);
  });
});
