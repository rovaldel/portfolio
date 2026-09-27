import {
  education,
  experiences,
  legalDocuments,
  navigationActions,
  projects,
  services,
  siteProfile,
  skillGroups,
} from '../content/site';
import { surfaces } from './routes';
import { themes } from './themes';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const unique = (values: string[]) => new Set(values).size === values.length;

export const validatePublicContent = () => {
  assert(siteProfile.fullName === 'Rodrigo Valdelvira Ortigosa', 'Identidad pública inválida');
  assert(
    siteProfile.displayName === 'Rodrigo Valdelvira' && siteProfile.primaryRole === 'AI Engineer',
    'Rol o nombre público inválido',
  );
  assert(siteProfile.location === 'Logroño, La Rioja · remoto', 'Ubicación pública inválida');
  assert(
    siteProfile.availability === 'Disponible para oportunidades profesionales en remoto',
    'Disponibilidad pública inválida',
  );
  assert(
    siteProfile.totalExperienceLabel.toLocaleLowerCase('es-ES').includes('experiencia profesional total'),
    'La experiencia total debe distinguirse de experiencia en IA',
  );
  assert(
    siteProfile.portrait.width > 0 &&
      siteProfile.portrait.height > 0 &&
      /^[a-f0-9]{64}$/.test(siteProfile.portrait.sourceHash),
    'Retrato sin dimensiones o hash',
  );
  assert(
    siteProfile.portrait.sources.length >= 2 &&
      siteProfile.portrait.sources.every((source) => source.src.startsWith('/images/')),
    'Fuentes de retrato inválidas',
  );
  const channels = Object.values(siteProfile.channels);
  assert(
    channels.map((channel) => channel.kind).join(',') === 'email,phone,linkedin',
    'Canales de contacto incompletos o desordenados',
  );
  assert(siteProfile.channels.email.href === 'mailto:rodrigo.valdelvira@gmail.com', 'Email público inválido');
  assert(siteProfile.channels.phone.href === 'tel:+34653850674', 'Teléfono público inválido');
  assert(
    siteProfile.channels.linkedin.href === 'https://www.linkedin.com/in/rovaldel',
    'LinkedIn público inválido',
  );
  assert(
    projects.length === 2 && projects.map((item) => item.slug).join(',') === 'leadia,nami',
    'Catálogo de proyectos inválido',
  );
  assert(
    services.length === 6 && unique(services.map((item) => item.slug)),
    'Catálogo de servicios inválido',
  );
  assert(
    services.every(
      (item, index) =>
        item.order === index + 1 &&
        item.summary &&
        item.description &&
        item.icon &&
        item.provenance.length > 0,
    ),
    'Servicio incompleto o sin orden/proveniencia',
  );
  assert(
    services.every((item) => item.contactSubject === `Consulta sobre: ${item.title}`),
    'Asunto de contacto no deriva del servicio',
  );
  assert(education.length === 6, 'Formación incompleta');
  assert(
    unique(education.map((item) => item.id)) &&
      education.every(
        (item, index) =>
          item.order === index + 1 && item.startYear <= item.endYear && item.provenance.length > 0,
      ),
    'Formación incompleta o sin orden/proveniencia',
  );
  assert(
    skillGroups.every((group) => group.skills.length > 0),
    'Habilidades vacías',
  );
  assert(
    unique(skillGroups.map((group) => group.id)) &&
      skillGroups.every((group, index) => group.order === index + 1 && group.provenance.length > 0),
    'Grupo de habilidades sin orden/proveniencia',
  );
  assert(
    skillGroups.every(
      (group) =>
        unique(group.skills.map((skill) => skill.name)) &&
        group.skills.every((skill, index) => skill.order === index + 1 && skill.name.trim().length > 0),
    ),
    'Habilidades duplicadas o desordenadas',
  );
  const allSkills: { name: string; order: number; level: number }[] = [];
  for (const group of skillGroups) allSkills.push(...group.skills);
  assert(
    allSkills.every((skill) => Number.isInteger(skill.level) && skill.level >= 1 && skill.level <= 5),
    'Los niveles orientativos deben estar entre 1 y 5',
  );
  assert(siteProfile.languages.length > 0 && siteProfile.interests.length > 0, 'Perfil incompleto');
  assert(
    navigationActions.length === 7 &&
      unique(navigationActions.map((action) => action.id)) &&
      navigationActions.every(
        (action) =>
          action.destination.startsWith('/') &&
          action.label &&
          action.response &&
          action.contentRefs.length > 0,
      ),
    'Acciones predeterminadas inválidas',
  );
  assert(
    navigationActions.every((action) =>
      surfaces.some((surface) => surface.canonicalPath === action.destination),
    ),
    'Acción con destino no canónico',
  );
  assert(
    surfaces.length === 15 &&
      unique(surfaces.map((surface) => surface.id)) &&
      unique(surfaces.map((surface) => surface.canonicalPath)),
    'Catálogo de superficies inválido',
  );
  assert(
    surfaces.every(
      (surface) =>
        surface.canonicalPath === surface.path &&
        surface.h1.trim().length > 0 &&
        surface.contentRefs.length > 0,
    ),
    'Superficie sin H1 o referencias de contenido',
  );
  assert(
    surfaces
      .filter((surface) => surface.publicationState === 'working-draft')
      .every((surface) => !surface.indexable && surface.indexability === 'noindex'),
    'Los borradores legales deben ser noindex',
  );
  assert(
    themes.length === 5 &&
      themes
        .filter((theme) => theme.isDefault)
        .map((theme) => theme.id)
        .join(',') === 'rioja' &&
      themes.every((theme, index) => theme.order === index + 1),
    'Catálogo de temas inválido',
  );
  assert(experiences.find((item) => item.id === 'cidatum')?.start === '2025-12', 'Fecha de Cidatum inválida');
  assert(
    experiences.find((item) => item.id === 'talenttools')?.end === '2025-12',
    'Fecha de TalentTools inválida',
  );
  assert(
    legalDocuments.length === 3 &&
      unique(legalDocuments.map((document) => document.kind)) &&
      legalDocuments.every((document) => document.status === 'working-draft' && document.sections.length > 0),
    'Estado o estructura legal inesperada',
  );
  assert(
    experiences.length === 5 &&
      unique(experiences.map((item) => item.id)) &&
      experiences.every(
        (item, index) =>
          item.order === index + 1 &&
          item.current === (item.end === null) &&
          /^\d{4}-\d{2}$/.test(item.start) &&
          item.provenance.length > 0,
      ),
    'Experiencia incompleta o con fechas/proveniencia inválidas',
  );
};

const approvedPublicContentRefs = new Set([
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

const normalizeMetadataText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-ES');

export const indexableSurfaces = surfaces.filter((surface) => surface.indexable);

export const validatePublicMetadata = () => {
  assert(indexableSurfaces.length > 0, 'No hay rutas públicas indexables');
  assert(
    unique(indexableSurfaces.map((surface) => surface.canonicalPath)),
    'Hay rutas canónicas indexables duplicadas',
  );

  for (const surface of indexableSurfaces) {
    assert(
      surface.indexability === 'index' && surface.publicationState === 'approved',
      'Una ruta indexable debe tener publicación aprobada: ' + surface.path,
    );
    assert(
      surface.canonicalPath.startsWith('/') &&
        surface.canonicalPath === surface.path &&
        !/[?#]/.test(surface.canonicalPath) &&
        (surface.canonicalPath === '/' || !surface.canonicalPath.endsWith('/')),
      'Ruta canónica inválida: ' + surface.path,
    );
    assert(
      surface.title.trim().length > 3 &&
        surface.description.trim().length >= 24 &&
        surface.h1.trim().length > 1,
      'Metadatos incompletos: ' + surface.path,
    );
    assert(
      !/[<>]/.test(surface.title + surface.description + surface.h1),
      'Metadatos con marcado HTML: ' + surface.path,
    );
    assert(
      surface.contentRefs.length > 0 &&
        surface.contentRefs.every((ref) => approvedPublicContentRefs.has(ref)),
      'Ruta indexable sin referencias aprobadas: ' + surface.path,
    );

    const title = normalizeMetadataText(surface.title);
    const headingWords = normalizeMetadataText(surface.h1)
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !['soy', 'the', 'and'].includes(word));
    assert(
      headingWords.some((word) => title.includes(word)),
      'El título no es coherente con el H1 de ' + surface.path,
    );
  }

  assert(
    surfaces
      .filter((surface) => surface.publicationState === 'working-draft')
      .every((surface) => !surface.indexable && surface.indexability === 'noindex'),
    'Los borradores deben quedar fuera del índice',
  );

  return true;
};

export interface JournalEntryCandidate {
  body: string;
  data: {
    title: string;
    slug: string;
    description: string;
    excerpt: string;
    category: string;
    author: string;
    status: string;
    readingMinutes: number;
  };
}

export const selectCompletePublishedArticles = <T extends JournalEntryCandidate>(
  entries: readonly T[],
): T[] => {
  const articleSurface = surfaces.find(
    (surface) => surface.path === '/bitacora/langgraph-para-agentes-en-produccion',
  );

  return entries.filter((entry) => {
    const title = entry.data.title.trim();
    const body = entry.body.trim();
    const titleWords = normalizeMetadataText(title)
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 4);

    return (
      entry.data.status === 'published' &&
      entry.data.slug === 'langgraph-para-agentes-en-produccion' &&
      title === articleSurface?.title &&
      entry.data.description === articleSurface?.description &&
      title.length > 0 &&
      entry.data.description.trim().length > 0 &&
      entry.data.excerpt.trim().length > 0 &&
      entry.data.category.trim().length > 0 &&
      entry.data.author.trim().length > 0 &&
      entry.data.readingMinutes > 0 &&
      body.length >= 800 &&
      titleWords.some((word) => normalizeMetadataText(body).includes(word))
    );
  });
};

validatePublicContent();
validatePublicMetadata();
