import { documentLocale, getUi, pathFor } from '../lib/i18n';

const locale = documentLocale();
const t = getUi(locale);

const thread = document.querySelector<HTMLElement>('[data-conversation-thread]');
const shell = document.querySelector<HTMLElement>('.site-shell');
const modalRoot = document.querySelector<HTMLElement>('[data-conversation-modal-root]');
const serviceTemplates = new Map(
  Array.from(document.querySelectorAll<HTMLTemplateElement>('[data-service-dialog-template]')).map(
    (template) => [template.dataset['serviceDialogTemplate'] ?? '', template],
  ),
);
const projectTemplates = new Map(
  Array.from(document.querySelectorAll<HTMLTemplateElement>('[data-project-dialog-template]')).map(
    (template) => [template.dataset['projectDialogTemplate'] ?? '', template],
  ),
);
const controller = new AbortController();

let activeDialog: { backdrop: HTMLElement; dialog: HTMLElement; trigger: HTMLAnchorElement } | null = null;
let dialogId = 0;

const namespaceIds = (fragment: DocumentFragment, prefix: string) => {
  const ids = new Map<string, string>();
  fragment.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
    const original = element.id;
    const namespaced = prefix + '-' + original;
    ids.set(original, namespaced);
    element.id = namespaced;
  });
  fragment.querySelectorAll<HTMLElement>('*').forEach((element) => {
    for (const attribute of ['aria-controls', 'aria-describedby', 'aria-labelledby', 'for']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      element.setAttribute(
        attribute,
        value
          .split(/\s+/)
          .map((id) => ids.get(id) ?? id)
          .join(' '),
      );
    }
    const href = element.getAttribute('href');
    if (href?.startsWith('#') && ids.has(href.slice(1))) {
      element.setAttribute('href', '#' + ids.get(href.slice(1)));
    }
  });
};

const focusableElements = (dialog: HTMLElement) =>
  Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden);

const closeDialog = (restoreFocus = true) => {
  if (!activeDialog) return;
  const active = activeDialog;
  activeDialog = null;
  active.backdrop.remove();
  if (shell) shell.inert = false;
  if (restoreFocus && active.trigger.isConnected) active.trigger.focus();
};

const openDialog = (template: HTMLTemplateElement, trigger: HTMLAnchorElement) => {
  if (!modalRoot || !shell) return;
  closeDialog(false);
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  namespaceIds(fragment, 'conversation-dialog-' + ++dialogId);
  const backdrop = fragment.querySelector<HTMLElement>('[data-conversation-dialog-backdrop]');
  const dialog = fragment.querySelector<HTMLElement>('[role="dialog"]');
  const closeLink = dialog?.querySelector<HTMLAnchorElement>('.modal-close');
  if (!backdrop || !dialog || !closeLink) return;

  modalRoot.append(fragment);
  shell.inert = true;
  activeDialog = { backdrop, dialog, trigger };
  closeLink.focus();

  backdrop.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (target === backdrop) {
        closeDialog();
        return;
      }
      if (target instanceof Element && target.closest('.modal-close') === closeLink) {
        event.preventDefault();
        closeDialog();
        return;
      }
      const askLink =
        target instanceof Element ? target.closest<HTMLAnchorElement>('[data-service-ask]') : null;
      if (askLink && activeDialog && thread?.contains(activeDialog.trigger)) {
        event.preventDefault();
        const serviceSlug = askLink.dataset['serviceAsk'];
        const title = activeDialog.dialog
          .querySelector('h2')
          ?.textContent?.trim()
          .toLocaleLowerCase(t.dateLocale);
        const response = activeDialog.dialog
          .querySelector<HTMLElement>('[data-service-description]')
          ?.textContent?.trim();
        if (serviceSlug && title && response) {
          closeDialog();
          window.dispatchEvent(
            new CustomEvent('portfolio:answer', {
              detail: {
                question: t.query.tellMeMore(title),
                response,
                destination: pathFor('contact', locale) + '?asunto=' + serviceSlug,
              },
            }),
          );
        }
      }
    },
    { signal: controller.signal },
  );
  dialog.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableElements(dialog);
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
    },
    { signal: controller.signal },
  );
};

if (thread && modalRoot && shell) {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>('[data-service-open], [data-project-open]');
      if (!link || !thread.contains(link)) return;
      const serviceSlug = link.dataset['serviceOpen'];
      const projectSlug = link.dataset['projectOpen'];
      const template = serviceSlug
        ? serviceTemplates.get(serviceSlug)
        : projectSlug
          ? projectTemplates.get(projectSlug)
          : undefined;
      if (!template) return;
      event.preventDefault();
      openDialog(template, link);
    },
    { signal: controller.signal },
  );

  window.addEventListener(
    'keydown',
    (event) => {
      if (!activeDialog || event.key !== 'Escape') return;
      event.preventDefault();
      closeDialog();
    },
    { signal: controller.signal },
  );
  window.addEventListener(
    'pagehide',
    () => {
      closeDialog(false);
      controller.abort();
    },
    { once: true, signal: controller.signal },
  );
}
