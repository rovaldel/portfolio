import type { APIRoute } from 'astro';
import { canonicalUrl, indexableSurfaces } from '../lib/routes';
import { siteProfile } from '../content/site';
import { siteProfileEn } from '../content/site.en';

export const prerender = true;

const entriesFor = (locale: 'es' | 'en') =>
  indexableSurfaces
    .filter((surface) => surface.locale === locale)
    .map(
      (surface) =>
        '- [' + surface.title + '](' + canonicalUrl(surface.canonicalPath) + '): ' + surface.description,
    )
    .join('\n');

export const GET: APIRoute = () => {
  return new Response(
    '# ' +
      siteProfile.displayName +
      '\n\n> AI Engineer y Data Scientist en Logroño, La Rioja. Colaboración en remoto.\n\n' +
      siteProfile.professionalSummary +
      '\n\nEspecialidades: agentes de IA, chatbots, RAG, ingeniería de datos y despliegue en producción.\n\n## Perfil, servicios y proyectos\n\n' +
      entriesFor('es') +
      '\n\n## English version\n\n' +
      siteProfileEn.professionalSummary +
      ' Available remotely from Logroño, La Rioja.\n\n' +
      entriesFor('en') +
      '\n\n## Contacto\n\n- Email: rodrigo.valdelvira@gmail.com\n- LinkedIn: ' +
      siteProfile.channels.linkedin.href +
      '\n\nToolkit IA y Bitácora: próximamente. Nami está en fase de diseño.\n',
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
    },
  );
};
