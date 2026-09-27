import { education, experiences, projects, siteProfile, skillGroups } from '../content/site';

const projectNames = projects.map((project) => project.title).join(' y ');
const educationInstitutions = [...new Set(education.map((record) => record.institution))].join(', ');
const experienceOrganizations = experiences.map((experience) => experience.organization).join(', ');

export { canonicalOrigin, canonicalUrl } from './site-urls';

export type SurfaceKind = 'home' | 'profile' | 'catalogue' | 'detail' | 'article' | 'contact' | 'legal';
export type PublicationState = 'approved' | 'working-draft';
export type Indexability = 'index' | 'noindex';

export interface PublicSurface {
  id: string;
  path: string;
  canonicalPath: string;
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

const routeDefinitions: Omit<
  PublicSurface,
  'id' | 'canonicalPath' | 'kind' | 'contentRefs' | 'indexability' | 'publicationState'
>[] = [
  {
    path: '/',
    title: 'Rodrigo Valdelvira · AI Engineer | Agentes de IA y RAG',
    description: siteProfile.professionalSummary + ' ' + siteProfile.location + '.',
    h1: 'Soy Rodrigo, AI Engineer',
    indexable: true,
    navigationLabel: 'Portada',
  },
  {
    path: '/sobre-mi',
    title: 'Sobre mí · Rodrigo Valdelvira',
    description: 'Perfil de ' + siteProfile.displayName + ': ' + siteProfile.professionalSummary,
    h1: 'Sobre mí',
    indexable: true,
    navigationLabel: 'Sobre mí',
  },
  {
    path: '/habilidades',
    title: 'Habilidades · Rodrigo Valdelvira',
    description: 'Competencias publicadas: ' + skillGroups.map((group) => group.name).join(', ') + '.',
    h1: 'Habilidades',
    indexable: true,
    navigationLabel: 'Habilidades',
  },
  {
    path: '/servicios',
    title: 'Servicios · Rodrigo Valdelvira',
    description:
      'Desarrollo de agentes de IA, chatbots, sistemas RAG y pipelines de datos. De la idea a producción con Rodrigo Valdelvira, AI Engineer en Logroño.',
    h1: 'Servicios',
    indexable: true,
    navigationLabel: 'Servicios',
  },
  {
    path: '/experiencia',
    title: 'Experiencia · Rodrigo Valdelvira',
    description: 'Trayectoria profesional en ' + experienceOrganizations + '.',
    h1: 'Experiencia',
    indexable: true,
    navigationLabel: 'Experiencia',
  },
  {
    path: '/formacion',
    title: 'Formación · Rodrigo Valdelvira',
    description: 'Formación y certificaciones en ' + educationInstitutions + '.',
    h1: 'Formación',
    indexable: true,
    navigationLabel: 'Formación',
  },
  {
    path: '/proyectos',
    title: 'Proyectos · Rodrigo Valdelvira',
    description: 'Proyectos publicados: ' + projectNames + '.',
    h1: 'Proyectos',
    indexable: true,
    navigationLabel: 'Proyectos',
  },
  {
    path: '/proyectos/leadia',
    title: 'Leadia · Rodrigo Valdelvira',
    description: projects.find((project) => project.slug === 'leadia')!.description,
    h1: 'Leadia',
    indexable: true,
    navigationLabel: 'Leadia',
  },
  {
    path: '/proyectos/nami',
    title: 'Nami · Rodrigo Valdelvira',
    description: projects.find((project) => project.slug === 'nami')!.description,
    h1: 'Nami',
    indexable: true,
    navigationLabel: 'Nami',
  },
  {
    path: '/bitacora',
    title: 'Bitácora · Rodrigo Valdelvira',
    description: 'Próximamente: decisiones de arquitectura y notas de trabajo sobre IA aplicada.',
    h1: 'Bitácora',
    indexable: false,
    navigationLabel: 'Bitácora',
  },
  {
    path: '/bitacora/langgraph-para-agentes-en-produccion',
    title: 'Cómo evalué tres frameworks de agentes antes de elegir LangGraph',
    description: 'Evaluación de CrewAI, AutoGen y LangGraph para agentes en producción.',
    h1: 'Cómo evalué tres frameworks de agentes antes de elegir LangGraph',
    indexable: false,
    navigationLabel: 'Artículo LangGraph',
  },
  {
    path: '/contacto',
    title: 'Contacto · Rodrigo Valdelvira',
    description:
      'Canales públicos de contacto de ' +
      siteProfile.displayName +
      ': ' +
      Object.values(siteProfile.channels)
        .map((channel) => channel.label)
        .join(', ') +
      '.',
    h1: 'Contacto',
    indexable: true,
    navigationLabel: 'Contacto',
  },
  {
    path: '/privacidad',
    title: 'Privacidad · borrador de trabajo',
    description: 'Borrador de privacidad.',
    h1: 'Privacidad',
    indexable: false,
    navigationLabel: 'Privacidad',
  },
  {
    path: '/cookies',
    title: 'Cookies · borrador de trabajo',
    description: 'Borrador sobre preferencias visuales.',
    h1: 'Cookies',
    indexable: false,
    navigationLabel: 'Cookies',
  },
  {
    path: '/terminos',
    title: 'Términos · borrador de trabajo',
    description: 'Borrador de términos.',
    h1: 'Términos',
    indexable: false,
    navigationLabel: 'Términos',
  },
];

const getSurfaceMetadata = (path: string): Pick<PublicSurface, 'kind' | 'contentRefs'> => {
  if (path === '/') return { kind: 'home', contentRefs: ['siteProfile', 'projects'] };
  if (path === '/sobre-mi')
    return { kind: 'profile', contentRefs: ['siteProfile', 'experiences', 'education'] };
  if (path === '/contacto') return { kind: 'contact', contentRefs: ['siteProfile.channels', 'services'] };
  if (path === '/bitacora/langgraph-para-agentes-en-produccion')
    return { kind: 'article', contentRefs: ['article.langgraph'] };
  if (path.startsWith('/proyectos/'))
    return { kind: 'detail', contentRefs: [`project.${path.slice('/proyectos/'.length)}`] };
  if (path.startsWith('/bitacora/')) return { kind: 'article', contentRefs: ['article.langgraph'] };
  if (['/privacidad', '/cookies', '/terminos'].includes(path))
    return { kind: 'legal', contentRefs: [`legal.${path.slice(1)}`] };
  if (
    ['/habilidades', '/servicios', '/experiencia', '/formacion', '/proyectos', '/bitacora'].includes(path)
  ) {
    const ref = {
      '/habilidades': 'skillGroups',
      '/servicios': 'services',
      '/experiencia': 'experiences',
      '/formacion': 'education',
      '/proyectos': 'projects',
      '/bitacora': 'article.langgraph',
    }[path]!;
    return { kind: 'catalogue', contentRefs: [ref] };
  }
  return { kind: 'catalogue', contentRefs: [] };
};

export const surfaces: PublicSurface[] = routeDefinitions.map((surface) => {
  const metadata = getSurfaceMetadata(surface.path);
  const legal = metadata.kind === 'legal';
  return {
    ...surface,
    ...metadata,
    id: `surface:${surface.path === '/' ? 'home' : surface.path.slice(1)}`,
    canonicalPath: surface.path,
    indexability: surface.indexable ? 'index' : 'noindex',
    publicationState: legal ? 'working-draft' : 'approved',
  };
});

export const indexableSurfaces = surfaces.filter((surface) => surface.indexable);

export const byPath = (path: string) => surfaces.find((surface) => surface.path === path);
export const canonicalPaths = new Set(surfaces.map((surface) => surface.path));
export const legacyRedirects: Record<string, string> = {
  '/Rodrigo_Valdelvira_CV_AI_Engineer.pdf': '/Rodrigo-Valdelvira-CV.pdf',
};
