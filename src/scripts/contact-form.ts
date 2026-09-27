type ContactResponse = { ok?: boolean; message?: string };

const newIdempotencyKey = () =>
  window.crypto?.randomUUID?.() ?? `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const showNotice = (form: HTMLFormElement, state: 'success' | 'error', title: string, message: string) => {
  const notice = form.closest('.contact-layout')?.querySelector<HTMLElement>('[data-contact-status]');
  if (!notice) return;

  notice.dataset['state'] = state;
  notice.hidden = false;
  notice.setAttribute('role', state === 'success' ? 'status' : 'alert');
  notice.setAttribute('aria-live', state === 'success' ? 'polite' : 'assertive');
  const titleElement = notice.querySelector<HTMLElement>('[data-contact-status-title]');
  const messageElement = notice.querySelector<HTMLElement>('[data-contact-status-message]');
  const successIcon = notice.querySelector<HTMLElement>('[data-contact-icon-success]');
  const errorIcon = notice.querySelector<HTMLElement>('[data-contact-icon-error]');
  if (titleElement) titleElement.textContent = title;
  if (messageElement) messageElement.textContent = message;
  if (successIcon) successIcon.hidden = state !== 'success';
  if (errorIcon) errorIcon.hidden = state !== 'error';

  notice.focus({ preventScroll: true });
  notice.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'center',
  });
};

const submitContactForm = async (form: HTMLFormElement) => {
  if (form.dataset['submitting'] === 'true') return;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])');
  const originalLabel = button?.textContent ?? 'Enviar mensaje';
  const status = form.closest('.contact-layout')?.querySelector<HTMLElement>('[data-contact-status]');
  if (status) status.hidden = true;

  form.dataset['submitting'] = 'true';
  form.setAttribute('aria-busy', 'true');
  if (button) {
    button.disabled = true;
    button.textContent = 'Enviando…';
  }

  try {
    const response = await fetch(form.action, {
      method: form.method || 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    });
    const result = (await response.json().catch(() => null)) as ContactResponse | null;
    const idempotencyKey = form.elements.namedItem('idempotencyKey');
    if (idempotencyKey instanceof HTMLInputElement) idempotencyKey.value = newIdempotencyKey();

    if (!response.ok || result?.ok !== true) {
      showNotice(
        form,
        'error',
        'No se pudo enviar el mensaje',
        result?.message ?? 'Inténtalo de nuevo o escríbeme por email.',
      );
      return;
    }

    form.reset();
    if (idempotencyKey instanceof HTMLInputElement) idempotencyKey.value = newIdempotencyKey();
    showNotice(
      form,
      'success',
      'Mensaje enviado correctamente',
      'Gracias por escribirme. Te responderé con la mayor brevedad posible.',
    );
  } catch {
    showNotice(
      form,
      'error',
      'No se pudo conectar',
      'Revisa tu conexión e inténtalo de nuevo. También puedes escribirme por email.',
    );
  } finally {
    form.dataset['submitting'] = 'false';
    form.removeAttribute('aria-busy');
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
};

document.addEventListener('submit', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement) || !target.matches('[data-contact-form]')) return;
  event.preventDefault();
  void submitContactForm(target);
});
