import { getContent } from '../content';
import { locales, pathFor, routePaths } from './i18n';
import type { Locale, RouteId } from './i18n';

export { canonicalOrigin, canonicalUrl } from './site-urls';

export type SurfaceKind = 'home' | 'profile' | 'catalogue' | 'detail' | 'article' | 'contact' | 'legal';
export type PublicationState = 'approved' | 'working-draft';
export type Indexability = 'index' | 'noindex';

export interface PublicSurface {
  id: string;
  routeId: RouteId;
  locale: Locale;
  path: string;
  canonicalPath: string;
  /** The same page in every language, keyed by locale. */
  alternates: Record<Locale, string>;
  kind: SurfaceKind;
  title: string;
  description: string;
  h1: string;
  contentRefs: string[];
  indexable: boolean;
  indexability: Indexability;
  publicationState: PublicationState;
  navigationLabel: string;
}

interface RouteText {
  title: string;
  description: string;
  h1: string;
  navigationLabel: string;
}

const routeIndexable: Record<RouteId, boolean> = {
  home: true,
  about: true,
  skills: true,
  services: true,
  experience: true,
  education: true,
  projects: true,
  'project.leadia': true,
  'project.nami': true,
  journal: false,
  'journal.langgraph': false,
  contact: true,
  privacy: false,
  cookies: false,
  terms: false,
};

const routeOrder = Object.keys(routePaths) as RouteId[];

const routeTexts = (locale: Locale): Record<RouteId, RouteText> => {
  const content = getContent(locale);
  const { siteProfile, skillGroups, experiences, education, projects } = content;
  const organizations = experiences.map((experience) => experience.organization).join(', ');
  const institutions = [...new Set(education.map((record) => record.institution))].join(', ');
  const channels = Object.values(siteProfile.channels)
    .map((channel) => channel.label)
    .join(', ');
  const project = (slug: 'leadia' | 'nami') => projects.find((item) => item.slug === slug)!;

  if (locale === 'en') {
    const projectNames = projects.map((item) => item.title).join(' and ');
    return {
      home: {
        title: 'Rodrigo Valdelvira · AI Engineer | AI Agents and RAG',
        description: siteProfile.professionalSummary + ' ' + siteProfile.location + '.',
        h1: 'I’m Rodrigo, AI Engineer',
        navigationLabel: 'Home',
      },
      about: {
        title: 'About me · Rodrigo Valdelvira',
        description: 'Profile of ' + siteProfile.displayName + ': ' + siteProfile.professionalSummary,
        h1: 'About me',
        navigationLabel: 'About me',
      },
      skills: {
        title: 'Skills · Rodrigo Valdelvira',
        description: 'Published skills: ' + skillGroups.map((group) => group.name).join(', ') + '.',
        h1: 'Skills',
        navigationLabel: 'Skills',
      },
      services: {
        title: 'Services · Rodrigo Valdelvira',
        description:
          'Development of AI agents, chatbots, RAG systems and data pipelines. From idea to production with Rodrigo Valdelvira, AI Engineer in Logroño.',
        h1: 'Services',
        navigationLabel: 'Services',
      },
      experience: {
        title: 'Experience · Rodrigo Valdelvira',
        description: 'Professional career at ' + organizations + '.',
        h1: 'Experience',
        navigationLabel: 'Experience',
      },
      education: {
        title: 'Education · Rodrigo Valdelvira',
        description: 'Education and certifications at ' + institutions + '.',
        h1: 'Education',
        navigationLabel: 'Education',
      },
      projects: {
        title: 'Projects · Rodrigo Valdelvira',
        description: 'Published projects: ' + projectNames + '.',
        h1: 'Projects',
        navigationLabel: 'Projects',
      },
      'project.leadia': {
        title: 'Leadia · Rodrigo Valdelvira',
        description: project('leadia').description,
        h1: 'Leadia',
        navigationLabel: 'Leadia',
      },
      'project.nami': {
        title: 'Nami · Rodrigo Valdelvira',
        description: project('nami').description,
        h1: 'Nami',
        navigationLabel: 'Nami',
      },
      journal: {
        title: 'Journal · Rodrigo Valdelvira',
        description:
          'Articles by Rodrigo Valdelvira on architecture, agents and AI development in production.',
        h1: 'Journal',
        navigationLabel: 'Journal',
      },
      'journal.langgraph': {
        title: 'How I evaluated three agent frameworks before choosing LangGraph',
        description: 'Evaluation of CrewAI, AutoGen and LangGraph for production agents.',
        h1: 'How I evaluated three agent frameworks before choosing LangGraph',
        navigationLabel: 'LangGraph article',
      },
      contact: {
        title: 'Contact · Rodrigo Valdelvira',
        description: 'Public contact channels of ' + siteProfile.displayName + ': ' + channels + '.',
        h1: 'Contact',
        navigationLabel: 'Contact',
      },
      privacy: {
        title: 'Privacy · working draft',
        description: 'Draft privacy notice.',
        h1: 'Privacy',
        navigationLabel: 'Privacy',
      },
      cookies: {
        title: 'Cookies · working draft',
        description: 'Draft notice on visual preferences.',
        h1: 'Cookies',
        navigationLabel: 'Cookies',
      },
      terms: {
        title: 'Terms · working draft',
        description: 'Draft terms.',
        h1: 'Terms',
        navigationLabel: 'Terms',
      },
    };
  }

  const projectNames = projects.map((item) => item.title).join(' y ');
  return {
    home: {
      title: 'Rodrigo Valdelvira · AI Engineer | Agentes de IA y RAG',
      description: siteProfile.professionalSummary + ' ' + siteProfile.location + '.',
      h1: 'Soy Rodrigo, AI Engineer',
      navigationLabel: 'Portada',
    },
    about: {
      title: 'Sobre mí · Rodrigo Valdelvira',
      description: 'Perfil de ' + siteProfile.displayName + ': ' + siteProfile.professionalSummary,
      h1: 'Sobre mí',
      navigationLabel: 'Sobre mí',
    },
    skills: {
      title: 'Habilidades · Rodrigo Valdelvira',
      description: 'Competencias publicadas: ' + skillGroups.map((group) => group.name).join(', ') + '.',
      h1: 'Habilidades',
      navigationLabel: 'Habilidades',
    },
    services: {
      title: 'Servicios · Rodrigo Valdelvira',
      description:
        'Desarrollo de agentes de IA, chatbots, sistemas RAG y pipelines de datos. De la idea a producción con Rodrigo Valdelvira, AI Engineer en Logroño.',
      h1: 'Servicios',
      navigationLabel: 'Servicios',
    },
    experience: {
      title: 'Experiencia · Rodrigo Valdelvira',
      description: 'Trayectoria profesional en ' + organizations + '.',
      h1: 'Experiencia',
      navigationLabel: 'Experiencia',
    },
    education: {
      title: 'Formación · Rodrigo Valdelvira',
      description: 'Formación y certificaciones en ' + institutions + '.',
      h1: 'Formación',
      navigationLabel: 'Formación',
    },
    projects: {
      title: 'Proyectos · Rodrigo Valdelvira',
      description: 'Proyectos publicados: ' + projectNames + '.',
      h1: 'Proyectos',
      navigationLabel: 'Proyectos',
    },
    'project.leadia': {
      title: 'Leadia · Rodrigo Valdelvira',
      description: project('leadia').description,
      h1: 'Leadia',
      navigationLabel: 'Leadia',
    },
    'project.nami': {
      title: 'Nami · Rodrigo Valdelvira',
      description: project('nami').description,
      h1: 'Nami',
      navigationLabel: 'Nami',
    },
    journal: {
      title: 'Bitácora · Rodrigo Valdelvira',
      description:
        'Artículos de Rodrigo Valdelvira sobre arquitectura, agentes y desarrollo de IA en producción.',
      h1: 'Bitácora',
      navigationLabel: 'Bitácora',
    },
    'journal.langgraph': {
      title: 'Cómo evalué tres frameworks de agentes antes de elegir LangGraph',
      description: 'Evaluación de CrewAI, AutoGen y LangGraph para agentes en producción.',
      h1: 'Cómo evalué tres frameworks de agentes antes de elegir LangGraph',
      navigationLabel: 'Artículo LangGraph',
    },
    contact: {
      title: 'Contacto · Rodrigo Valdelvira',
      description: 'Canales públicos de contacto de ' + siteProfile.displayName + ': ' + channels + '.',
      h1: 'Contacto',
      navigationLabel: 'Contacto',
    },
    privacy: {
      title: 'Privacidad · borrador de trabajo',
      description: 'Borrador de privacidad.',
      h1: 'Privacidad',
      navigationLabel: 'Privacidad',
    },
    cookies: {
      title: 'Cookies · borrador de trabajo',
      description: 'Borrador sobre preferencias visuales.',
      h1: 'Cookies',
      navigationLabel: 'Cookies',
    },
    terms: {
      title: 'Términos · borrador de trabajo',
      description: 'Borrador de términos.',
      h1: 'Términos',
      navigationLabel: 'Términos',
    },
  };
};

const getSurfaceMetadata = (id: RouteId): Pick<PublicSurface, 'kind' | 'contentRefs'> => {
  if (id === 'home') return { kind: 'home', contentRefs: ['siteProfile', 'projects'] };
  if (id === 'about') return { kind: 'profile', contentRefs: ['siteProfile', 'experiences', 'education'] };
  if (id === 'contact') return { kind: 'contact', contentRefs: ['siteProfile.channels', 'services'] };
  if (id === 'journal.langgraph') return { kind: 'article', contentRefs: ['article.langgraph'] };
  if (id.startsWith('project.')) return { kind: 'detail', contentRefs: [id] };
  if (id === 'privacy' || id === 'cookies' || id === 'terms')
    return { kind: 'legal', contentRefs: [`legal.${routePaths[id].es.slice(1)}`] };
  const catalogueRef: Partial<Record<RouteId, string>> = {
    skills: 'skillGroups',
    services: 'services',
    experience: 'experiences',
    education: 'education',
    projects: 'projects',
    journal: 'article.langgraph',
  };
  return { kind: 'catalogue', contentRefs: catalogueRef[id] ? [catalogueRef[id]!] : [] };
};

const buildSurfaces = (locale: Locale): PublicSurface[] => {
  const texts = routeTexts(locale);
  return routeOrder.map((routeId) => {
    const path = pathFor(routeId, locale);
    const metadata = getSurfaceMetadata(routeId);
    const indexable = routeIndexable[routeId];
    const slug = routeId === 'home' ? 'home' : path.replace(/^\/(en\/)?/, '');
    return {
      ...texts[routeId],
      ...metadata,
      id: locale === 'es' ? `surface:${slug}` : `surface:en/${slug}`,
      routeId,
      locale,
      path,
      canonicalPath: path,
      alternates: { es: pathFor(routeId, 'es'), en: pathFor(routeId, 'en') },
      indexable,
      indexability: indexable ? 'index' : 'noindex',
      publicationState: metadata.kind === 'legal' ? 'working-draft' : 'approved',
    };
  });
};

export const surfacesByLocale: Record<Locale, PublicSurface[]> = {
  es: buildSurfaces('es'),
  en: buildSurfaces('en'),
};

/** Spanish surfaces: the original catalogue, unchanged for existing consumers. */
export const surfaces: PublicSurface[] = surfacesByLocale.es;
export const allSurfaces: PublicSurface[] = locales.flatMap((locale) => surfacesByLocale[locale]);

export const indexableSurfaces = allSurfaces.filter((surface) => surface.indexable);

export const byPath = (path: string) => allSurfaces.find((surface) => surface.path === path);
export const canonicalPaths = new Set(allSurfaces.map((surface) => surface.path));
export const legacyRedirects: Record<string, string> = {
  '/Rodrigo_Valdelvira_CV_AI_Engineer.pdf': '/Rodrigo-Valdelvira-CV.pdf',
};
