import { getContent } from '../content';
import { education, experiences, projects, services, siteProfile, skillGroups } from '../content/site';
import { pathFor } from './i18n';
import type { Locale, RouteId } from './i18n';
import { allSurfaces } from './routes';

export interface PortfolioIntent {
  id: string;
  phrases: readonly string[];
  response: string;
  destination: string;
  contentRefs: readonly string[];
  provenance: readonly string[];
}

export const approvedIntentContentRefs = new Set([
  'siteProfile',
  'siteProfile.channels',
  'siteProfile.languages',
  'siteProfile.interests',
  'projects',
  'experiences',
  'education',
  'skillGroups',
  'services',
  'project.leadia',
  'project.nami',
  'article.langgraph',
]);

const canonicalPath = (routeId: RouteId, locale: Locale) => {
  const path = pathFor(routeId, locale);
  const surface = allSurfaces.find((item) => item.path === path && item.publicationState === 'approved');
  if (!surface) throw new Error('El destino no es una ruta pública canónica: ' + path);
  return surface.canonicalPath;
};

const formatMonth = (value: string, locale: Locale) => {
  const [year, month] = value.split('-');
  const monthName = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'es-ES', {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
  return locale === 'en' ? monthName + ' ' + year : monthName + ' de ' + year;
};

const articleSources: Record<Locale, string> = {
  es: 'src/content/bitacora/langgraph-para-agentes-en-produccion.md',
  en: 'src/content/bitacora/langgraph-for-production-agents.md',
};

export const approvedIntentProvenance = new Set([
  ...siteProfile.provenance,
  ...education.flatMap((record) => record.provenance),
  ...experiences.flatMap((record) => record.provenance),
  ...projects.flatMap((project) => project.provenance),
  ...services.flatMap((service) => service.provenance),
  ...skillGroups.flatMap((group) => group.provenance),
  ...Object.values(articleSources),
]);

const uniqueProvenance = (references: string[]) => [...new Set(references)];

const phrases: Record<Locale, Record<string, string[]>> = {
  es: {
    about: ['sobre mí', 'quién es rodrigo', 'perfil profesional', 'a qué se dedica rodrigo'],
    skills: ['habilidades', 'tecnologías', 'herramientas', 'qué tecnologías usa rodrigo'],
    services: ['servicios', 'qué servicios ofreces', 'cómo puedes ayudarme', 'colaborar'],
    projects: ['proyectos', 'portfolio de proyectos', 'qué proyectos tiene rodrigo'],
    leadia: ['leadia', 'agente de voz', 'voz con ia', 'llamadas con inteligencia artificial'],
    nami: ['nami', 'proyecto nami', 'aplicación de bienestar'],
    'experience-cv': ['experiencia profesional', 'currículum', 'curriculum', 'cv', 'trayectoria profesional'],
    cidatum: [
      'cidatum',
      'trabajo actual',
      'puesto actual',
      'ingeniero de inteligencia artificial en cidatum',
    ],
    'talenttools-inclunia': [
      'talenttools',
      'inclunia',
      'fundación once',
      'fundacion once',
      'habla con inclunia',
    ],
    education: ['formación', 'formacion', 'estudios', 'educación', 'educacion', 'certificaciones'],
    languages: ['idiomas', 'qué idiomas hablas', 'idiomas de rodrigo'],
    interests: ['intereses', 'qué te interesa', 'temas que te interesan'],
    contact: ['contacto', 'cómo contactar', 'email', 'teléfono', 'linkedin'],
    'agent-frameworks': [
      'langgraph',
      'crewai',
      'autogen',
      'frameworks de agentes',
      'bitácora',
      'bitacora',
      'artículo de agentes',
    ],
  },
  en: {
    about: ['about me', 'who is rodrigo', 'professional profile', 'what does rodrigo do'],
    skills: ['skills', 'technologies', 'tools', 'tech stack', 'what technologies does rodrigo use'],
    services: [
      'services',
      'what services do you offer',
      'how can you help me',
      'collaborate',
      'work together',
    ],
    projects: ['projects', 'project portfolio', 'what projects does rodrigo have'],
    leadia: ['leadia', 'voice agent', 'voice ai', 'ai phone calls'],
    nami: ['nami', 'nami project', 'wellbeing app'],
    'experience-cv': [
      'experience',
      'professional experience',
      'work history',
      'career',
      'resume',
      'curriculum vitae',
      'cv',
    ],
    cidatum: ['cidatum', 'current job', 'current position', 'current role'],
    'talenttools-inclunia': ['talenttools', 'inclunia', 'fundacion once', 'habla con inclunia'],
    education: ['education', 'studies', 'degrees', 'qualifications', 'certifications'],
    languages: ['languages', 'what languages do you speak', 'languages does rodrigo speak'],
    interests: ['interests', 'what interests you', 'topics you are interested in'],
    contact: ['contact', 'how to contact', 'email', 'phone', 'linkedin'],
    'agent-frameworks': [
      'langgraph',
      'crewai',
      'autogen',
      'agent frameworks',
      'journal',
      'article about agents',
    ],
  },
};

const copy = {
  es: {
    languages: 'Idiomas publicados: ',
    interests: 'Intereses publicados: ',
    status: ' Estado: ',
    cidatum: (role: string, organization: string, location: string, mode: string, since: string) =>
      `${role} en ${organization}, ${location}, modalidad ${mode}, desde ${since} hasta la actualidad.`,
    frameworks:
      'Evalué CrewAI, AutoGen y LangGraph durante tres semanas para construir agentes en producción. Elegí LangGraph por su estado explícito y el control que ofrece para depurar fallos.',
  },
  en: {
    languages: 'Published languages: ',
    interests: 'Published interests: ',
    status: ' Status: ',
    cidatum: (role: string, organization: string, location: string, mode: string, since: string) =>
      `${role} at ${organization}, ${location}, ${mode}, from ${since} to the present.`,
    frameworks:
      'I evaluated CrewAI, AutoGen and LangGraph for three weeks to build production agents. I chose LangGraph for its explicit state and the control it gives me to debug failures.',
  },
} as const;

const modeLabel: Record<Locale, Record<'presencial' | 'remoto', string>> = {
  es: { presencial: 'presencial', remoto: 'remoto' },
  en: { presencial: 'on-site', remoto: 'remote' },
};

const buildIntents = (locale: Locale): PortfolioIntent[] => {
  const content = getContent(locale);
  const text = copy[locale];
  const actionResponse = (id: string) => {
    const action = content.navigationActions.find((item) => item.id === id);
    if (!action) throw new Error('Falta la acción aprobada: ' + id);
    return action.response;
  };
  const leadia = content.projects.find((project) => project.slug === 'leadia');
  const nami = content.projects.find((project) => project.slug === 'nami');
  const cidatum = content.experiences.find((experience) => experience.id === 'cidatum');
  const talentTools = content.experiences.find((experience) => experience.id === 'talenttools');
  if (!leadia || !nami || !cidatum || !talentTools) {
    throw new Error('Falta contenido aprobado requerido por el catálogo de intenciones.');
  }
  const p = phrases[locale];

  return [
    {
      id: 'about',
      phrases: p['about']!,
      response: actionResponse('about'),
      destination: canonicalPath('about', locale),
      contentRefs: ['siteProfile', 'experiences'],
      provenance: uniqueProvenance([
        ...content.siteProfile.provenance,
        ...content.experiences.flatMap((item) => item.provenance),
      ]),
    },
    {
      id: 'skills',
      phrases: p['skills']!,
      response: actionResponse('skills'),
      destination: canonicalPath('skills', locale),
      contentRefs: ['skillGroups'],
      provenance: uniqueProvenance(content.skillGroups.flatMap((group) => group.provenance)),
    },
    {
      id: 'services',
      phrases: p['services']!,
      response: actionResponse('services'),
      destination: canonicalPath('services', locale),
      contentRefs: ['services'],
      provenance: uniqueProvenance(content.services.flatMap((service) => service.provenance)),
    },
    {
      id: 'projects',
      phrases: p['projects']!,
      response: actionResponse('projects'),
      destination: canonicalPath('projects', locale),
      contentRefs: ['projects'],
      provenance: uniqueProvenance(content.projects.flatMap((project) => project.provenance)),
    },
    {
      id: 'leadia',
      phrases: p['leadia']!,
      response: leadia.description,
      destination: canonicalPath('project.leadia', locale),
      contentRefs: ['project.leadia'],
      provenance: leadia.provenance,
    },
    {
      id: 'nami',
      phrases: p['nami']!,
      response: nami.title + ': ' + nami.description + text.status + nami.statusLabel + '.',
      destination: canonicalPath('project.nami', locale),
      contentRefs: ['project.nami'],
      provenance: nami.provenance,
    },
    {
      id: 'experience-cv',
      phrases: p['experience-cv']!,
      response: content.siteProfile.totalExperienceLabel,
      destination: canonicalPath('experience', locale),
      contentRefs: ['siteProfile', 'experiences'],
      provenance: uniqueProvenance([
        ...content.siteProfile.provenance,
        ...content.experiences.flatMap((item) => item.provenance),
      ]),
    },
    {
      id: 'cidatum',
      phrases: p['cidatum']!,
      response: text.cidatum(
        cidatum.role,
        cidatum.organization,
        cidatum.location,
        modeLabel[locale][cidatum.workMode],
        formatMonth(cidatum.start, locale),
      ),
      destination: canonicalPath('experience', locale),
      contentRefs: ['experiences'],
      provenance: cidatum.provenance,
    },
    {
      id: 'talenttools-inclunia',
      phrases: p['talenttools-inclunia']!,
      response: talentTools.highlights.join(' '),
      destination: canonicalPath('experience', locale),
      contentRefs: ['experiences'],
      provenance: talentTools.provenance,
    },
    {
      id: 'education',
      phrases: p['education']!,
      response: content.education
        .map((record) => record.title + ' (' + record.institution + ', ' + record.years + ')')
        .join('; '),
      destination: canonicalPath('education', locale),
      contentRefs: ['education'],
      provenance: uniqueProvenance(content.education.flatMap((record) => record.provenance)),
    },
    {
      id: 'languages',
      phrases: p['languages']!,
      response: text.languages + content.siteProfile.languages.join(', ') + '.',
      destination: canonicalPath('about', locale),
      contentRefs: ['siteProfile.languages'],
      provenance: content.siteProfile.provenance,
    },
    {
      id: 'interests',
      phrases: p['interests']!,
      response: text.interests + content.siteProfile.interests.join(', ') + '.',
      destination: canonicalPath('about', locale),
      contentRefs: ['siteProfile.interests'],
      provenance: content.siteProfile.provenance,
    },
    {
      id: 'contact',
      phrases: p['contact']!,
      response: actionResponse('contact'),
      destination: canonicalPath('contact', locale),
      contentRefs: ['siteProfile.channels'],
      provenance: content.siteProfile.provenance,
    },
    {
      id: 'agent-frameworks',
      phrases: p['agent-frameworks']!,
      response: text.frameworks,
      destination: canonicalPath('journal.langgraph', locale),
      contentRefs: ['article.langgraph'],
      provenance: [articleSources[locale]],
    },
  ];
};

export const intentsByLocale: Record<Locale, PortfolioIntent[]> = {
  es: buildIntents('es'),
  en: buildIntents('en'),
};

/** Spanish catalogue, kept as the default export shape for existing consumers. */
export const intents: PortfolioIntent[] = intentsByLocale.es;

export const getIntents = (locale: Locale): PortfolioIntent[] => intentsByLocale[locale];
