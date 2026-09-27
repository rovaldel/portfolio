import { intents } from '../lib/intents';
import { resolveIntent } from '../lib/intent-matching';

const controller = new AbortController();
const form = document.querySelector<HTMLFormElement>('[data-query-form]');
const field = form?.querySelector<HTMLTextAreaElement>('[data-query-field]');
const submit = form?.querySelector<HTMLButtonElement>('[data-query-submit]');
const count = form?.querySelector<HTMLElement>('[data-query-count]');
const limitStatus = form?.querySelector<HTMLElement>('[data-query-limit]');
const routeContent = document.querySelector<HTMLElement>('[data-route-content]');
const thread = document.querySelector<HTMLElement>('[data-conversation-thread]');
const scrollRegion = document.querySelector<HTMLElement>('#contenido');
const responseStatus = document.querySelector<HTMLElement>('[data-query-status]');
const templates = new Map(
  Array.from(document.querySelectorAll<HTMLTemplateElement>('[data-conversation-template]')).map(
    (template) => [template.dataset['conversationTemplate'] ?? '', template],
  ),
);
const maximumLength = 300;
const timers = new Set<number>();
let turnId = 0;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToLatest = (behavior: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth') => {
  if (!scrollRegion) return;
  window.requestAnimationFrame(() => {
    scrollRegion.scrollTo({ top: scrollRegion.scrollHeight, behavior });
  });
};

const activateThread = () => {
  if (!thread || !routeContent) return false;
  if (thread.hidden) {
    routeContent.replaceChildren();
    routeContent.hidden = true;
    thread.hidden = false;
    document.body.classList.add('is-chat-active');
  }
  return true;
};

const namespaceIds = (fragment: DocumentFragment, prefix: string) => {
  const elements = Array.from(fragment.querySelectorAll<HTMLElement>('[id]'));
  const ids = new Map<string, string>();
  elements.forEach((element) => {
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

const createTurn = (question: string, response: string, templateKind?: string) => {
  if (!activateThread() || !thread) return;

  const turn = document.createElement('section');
  turn.className = 'conversation-turn';
  turn.dataset['queryTurn'] = 'true';
  turn.dataset['turnId'] = String(++turnId);

  const user = document.createElement('p');
  user.className = 'conversation-user';
  user.textContent = question;

  const assistant = document.createElement('article');
  assistant.className = 'conversation-message';
  const avatar = document.createElement('img');
  avatar.className = 'conversation-message__avatar';
  avatar.src = '/images/rodrigo-valdelvira.png';
  avatar.alt = '';
  avatar.width = 34;
  avatar.height = 34;

  const body = document.createElement('div');
  body.className = 'conversation-message__body';
  const pending = document.createElement('div');
  pending.className = 'conversation-response-pending';
  pending.setAttribute('aria-hidden', 'true');
  pending.innerHTML =
    '<div class="conversation-response-pending__heading"><span class="conversation-response-pending__pulse"></span><span>razonando</span></div>' +
    '<ol class="conversation-response-pending__steps"><li class="conversation-response-pending__step conversation-response-pending__step--done"><span class="conversation-response-pending__node"></span><span>recuperando contexto</span></li>' +
    '<li class="conversation-response-pending__step conversation-response-pending__step--active"><span class="conversation-response-pending__node"></span><span>seleccionando fragmentos</span></li>' +
    '<li class="conversation-response-pending__step"><span class="conversation-response-pending__node"></span><span>componiendo respuesta</span></li></ol>';
  body.append(pending);
  assistant.append(avatar, body);
  turn.append(user, assistant);
  thread.append(turn);
  if (responseStatus) responseStatus.textContent = 'Preparando una respuesta.';
  scrollToLatest();

  const showResponse = () => {
    pending.remove();
    body.classList.add('conversation-message__body--revealing');
    const template = templateKind ? templates.get(templateKind) : undefined;
    if (template) {
      const content = template.content.cloneNode(true) as DocumentFragment;
      namespaceIds(content, 'turn-' + turn.dataset['turnId']);
      body.append(content);
    } else {
      const paragraph = document.createElement('p');
      paragraph.className = 'conversation-response-text';
      body.append(paragraph);
      const reduced = reducedMotion();
      if (reduced) {
        paragraph.textContent = response;
      } else {
        paragraph.classList.add('conversation-response-text--streaming');
        let index = 0;
        const stream = window.setInterval(() => {
          index = Math.min(response.length, index + 2);
          paragraph.textContent = response.slice(0, index);
          scrollToLatest('auto');
          if (index >= response.length) {
            window.clearInterval(stream);
            timers.delete(stream);
            paragraph.classList.remove('conversation-response-text--streaming');
            finishResponse();
          }
        }, 18);
        timers.add(stream);
        return;
      }
    }
    finishResponse();
  };

  // Templates already contain their intended calls to action. Plain replies
  // deliberately end with their answer; an extra generic "Ver más" link made
  // every simulated conversation look unfinished.
  const finishResponse = () => {
    if (responseStatus) responseStatus.textContent = 'Respuesta lista.';
    scrollToLatest();
  };

  const delay = reducedMotion() ? 0 : 1100;
  const timer = window.setTimeout(showResponse, delay);
  timers.add(timer);
};

const templateForIntent = (intentId: string) => {
  const map: Record<string, string> = {
    about: 'profile',
    languages: 'profile',
    interests: 'profile',
    skills: 'skills',
    services: 'services',
    projects: 'projects',
    'experience-cv': 'experience',
    cidatum: 'experience',
    'talenttools-inclunia': 'experience',
    education: 'education',
    contact: 'contact',
  };
  return map[intentId];
};

const followUpLabels: Record<string, string> = {
  skills: 'Habilidades',
  projects: 'Proyectos',
  experience: 'Experiencia',
  contact: 'Contacto',
};
const followUpIntentIds: Record<string, string> = {
  experience: 'experience-cv',
};

document.addEventListener(
  'click',
  (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const followUp = target?.closest<HTMLAnchorElement>('[data-conversation-followup]');
    if (followUp && thread?.contains(followUp)) {
      const followUpId = followUp.dataset['conversationFollowup'];
      const intentId = followUpId ? (followUpIntentIds[followUpId] ?? followUpId) : undefined;
      const intent = intents.find((item) => item.id === intentId);
      if (!intent) return;
      event.preventDefault();
      createTurn(
        followUpLabels[intent.id] ?? followUp.textContent?.trim() ?? 'Continuar conversación',
        intent.response,
        templateForIntent(intent.id),
      );
      return;
    }
  },
  { signal: controller.signal },
);

if (form && field && submit && count && limitStatus && thread) {
  const updateCount = () => {
    if (field.value.length > maximumLength) field.value = field.value.slice(0, maximumLength);
    count.textContent = field.value.length + ' de ' + maximumLength + ' caracteres';
    limitStatus.textContent =
      field.value.length === maximumLength ? 'Límite de 300 caracteres alcanzado.' : '';
  };

  const submitQuery = () => {
    const text = field.value.trim();
    if (!text) return;
    const decision = resolveIntent(text);
    if (decision.state === 'recognized') {
      createTurn(text, decision.intent.response, templateForIntent(decision.intent.id));
    } else if (decision.state === 'ambiguous') {
      createTurn(text, 'Hay varias secciones posibles. ¿Cuál quieres consultar?', 'fallback');
    } else {
      createTurn(text, 'No encuentro una respuesta clara para esa consulta.', 'fallback');
    }
    field.value = '';
    updateCount();
  };

  field.addEventListener('input', updateCount, { signal: controller.signal });
  field.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        submitQuery();
      }
    },
    { signal: controller.signal },
  );
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      submitQuery();
    },
    { signal: controller.signal },
  );
  updateCount();
  if (window.location.hash === '#consulta-langgraph') {
    field.value = 'LangGraph';
    updateCount();
    submitQuery();
  }
}

window.addEventListener(
  'portfolio:answer',
  (event) => {
    const detail = (event as CustomEvent<{ question: string; response: string; destination: string }>).detail;
    if (detail) createTurn(detail.question, detail.response);
  },
  { signal: controller.signal },
);

window.addEventListener(
  'portfolio:action',
  (event) => {
    const detail = (
      event as CustomEvent<{
        label: string;
        response: string;
        destination: string;
        kind?: string;
      }>
    ).detail;
    if (detail) createTurn(detail.label, detail.response, detail.kind);
  },
  { signal: controller.signal },
);

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  thread?.replaceChildren();
  if (field && count && limitStatus) {
    field.value = '';
    count.textContent = '0 de ' + maximumLength + ' caracteres';
    limitStatus.textContent = '';
  }
  for (const timer of timers) {
    window.clearTimeout(timer);
    window.clearInterval(timer);
  }
  timers.clear();
  controller.abort();
});
