import {
  education,
  experiences,
  navigationActions,
  projects,
  services,
  siteProfile,
  skillGroups,
} from '../content/site';
import { surfaces } from './routes';

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

const actionResponse = (id: string) => {
  const action = navigationActions.find((item) => item.id === id);
  if (!action) throw new Error('Falta la acción aprobada: ' + id);
  return action.response;
};

const canonicalPath = (path: string) => {
  const surface = surfaces.find((item) => item.path === path && item.publicationState === 'approved');
  if (!surface) throw new Error('El destino no es una ruta pública canónica: ' + path);
  return surface.canonicalPath;
};

const leadia = projects.find((project) => project.slug === 'leadia');
const nami = projects.find((project) => project.slug === 'nami');
const cidatum = experiences.find((experience) => experience.id === 'cidatum');
const talentTools = experiences.find((experience) => experience.id === 'talenttools');
const article = surfaces.find((surface) => surface.path === '/bitacora/langgraph-para-agentes-en-produccion');

if (!leadia || !nami || !cidatum || !talentTools || !article) {
  throw new Error('Falta contenido aprobado requerido por el catálogo de intenciones.');
}

const formatMonth = (value: string) => {
  const [year, month] = value.split('-');
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
  );
  return monthName + ' de ' + year;
};

export const approvedIntentProvenance = new Set([
  ...siteProfile.provenance,
  ...education.flatMap((record) => record.provenance),
  ...experiences.flatMap((record) => record.provenance),
  ...projects.flatMap((project) => project.provenance),
  ...services.flatMap((service) => service.provenance),
  ...skillGroups.flatMap((group) => group.provenance),
  'src/content/bitacora/langgraph-para-agentes-en-produccion.md',
]);

const uniqueProvenance = (references: string[]) => [...new Set(references)];

export const intents: PortfolioIntent[] = [
  {
    id: 'about',
    phrases: ['sobre mí', 'quién es rodrigo', 'perfil profesional', 'a qué se dedica rodrigo'],
    response: actionResponse('about'),
    destination: canonicalPath('/sobre-mi'),
    contentRefs: ['siteProfile', 'experiences'],
    provenance: uniqueProvenance([
      ...siteProfile.provenance,
      ...experiences.flatMap((item) => item.provenance),
    ]),
  },
  {
    id: 'skills',
    phrases: ['habilidades', 'tecnologías', 'herramientas', 'qué tecnologías usa rodrigo'],
    response: actionResponse('skills'),
    destination: canonicalPath('/habilidades'),
    contentRefs: ['skillGroups'],
    provenance: uniqueProvenance(skillGroups.flatMap((group) => group.provenance)),
  },
  {
    id: 'services',
    phrases: ['servicios', 'qué servicios ofreces', 'cómo puedes ayudarme', 'colaborar'],
    response: actionResponse('services'),
    destination: canonicalPath('/servicios'),
    contentRefs: ['services'],
    provenance: uniqueProvenance(services.flatMap((service) => service.provenance)),
  },
  {
    id: 'projects',
    phrases: ['proyectos', 'portfolio de proyectos', 'qué proyectos tiene rodrigo'],
    response: actionResponse('projects'),
    destination: canonicalPath('/proyectos'),
    contentRefs: ['projects'],
    provenance: uniqueProvenance(projects.flatMap((project) => project.provenance)),
  },
  {
    id: 'leadia',
    phrases: ['leadia', 'agente de voz', 'voz con ia', 'llamadas con inteligencia artificial'],
    response: leadia.description,
    destination: canonicalPath('/proyectos/leadia'),
    contentRefs: ['project.leadia'],
    provenance: leadia.provenance,
  },
  {
    id: 'nami',
    phrases: ['nami', 'proyecto nami', 'aplicación de bienestar'],
    response: nami.title + ': ' + nami.description + ' Estado: ' + nami.statusLabel + '.',
    destination: canonicalPath('/proyectos/nami'),
    contentRefs: ['project.nami'],
    provenance: nami.provenance,
  },
  {
    id: 'experience-cv',
    phrases: ['experiencia profesional', 'currículum', 'curriculum', 'cv', 'trayectoria profesional'],
    response: siteProfile.totalExperienceLabel,
    destination: canonicalPath('/experiencia'),
    contentRefs: ['siteProfile', 'experiences'],
    provenance: uniqueProvenance([
      ...siteProfile.provenance,
      ...experiences.flatMap((item) => item.provenance),
    ]),
  },
  {
    id: 'cidatum',
    phrases: [
      'cidatum',
      'trabajo actual',
      'puesto actual',
      'ingeniero de inteligencia artificial en cidatum',
    ],
    response:
      cidatum.role +
      ' en ' +
      cidatum.organization +
      ', ' +
      cidatum.location +
      ', modalidad ' +
      cidatum.workMode +
      ', desde ' +
      formatMonth(cidatum.start) +
      ' hasta la actualidad.',
    destination: canonicalPath('/experiencia'),
    contentRefs: ['experiences'],
    provenance: cidatum.provenance,
  },
  {
    id: 'talenttools-inclunia',
    phrases: ['talenttools', 'inclunia', 'fundación once', 'fundacion once', 'habla con inclunia'],
    response: talentTools.highlights.join(' '),
    destination: canonicalPath('/experiencia'),
    contentRefs: ['experiences'],
    provenance: talentTools.provenance,
  },
  {
    id: 'education',
    phrases: ['formación', 'formacion', 'estudios', 'educación', 'educacion', 'certificaciones'],
    response: education
      .map((record) => record.title + ' (' + record.institution + ', ' + record.years + ')')
      .join('; '),
    destination: canonicalPath('/formacion'),
    contentRefs: ['education'],
    provenance: uniqueProvenance(education.flatMap((record) => record.provenance)),
  },
  {
    id: 'languages',
    phrases: ['idiomas', 'qué idiomas hablas', 'idiomas de rodrigo'],
    response: 'Idiomas publicados: ' + siteProfile.languages.join(', ') + '.',
    destination: canonicalPath('/sobre-mi'),
    contentRefs: ['siteProfile.languages'],
    provenance: siteProfile.provenance,
  },
  {
    id: 'interests',
    phrases: ['intereses', 'qué te interesa', 'temas que te interesan'],
    response: 'Intereses publicados: ' + siteProfile.interests.join(', ') + '.',
    destination: canonicalPath('/sobre-mi'),
    contentRefs: ['siteProfile.interests'],
    provenance: siteProfile.provenance,
  },
  {
    id: 'contact',
    phrases: ['contacto', 'cómo contactar', 'email', 'teléfono', 'linkedin'],
    response: actionResponse('contact'),
    destination: canonicalPath('/contacto'),
    contentRefs: ['siteProfile.channels'],
    provenance: siteProfile.provenance,
  },
  {
    id: 'agent-frameworks',
    phrases: [
      'langgraph',
      'crewai',
      'autogen',
      'frameworks de agentes',
      'bitácora',
      'bitacora',
      'artículo de agentes',
    ],
    response:
      'Evalué CrewAI, AutoGen y LangGraph durante tres semanas para construir agentes en producción. Elegí LangGraph por su estado explícito y el control que ofrece para depurar fallos.',
    destination: canonicalPath('/bitacora/langgraph-para-agentes-en-produccion'),
    contentRefs: ['article.langgraph'],
    provenance: ['src/content/bitacora/langgraph-para-agentes-en-produccion.md'],
  },
];
