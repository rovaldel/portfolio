import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bitacora = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bitacora' }),
  schema: z.object({
    title: z.string(),
    slug: z.enum(['langgraph-para-agentes-en-produccion', 'langgraph-for-production-agents']),
    locale: z.enum(['es', 'en']).default('es'),
    description: z.string(),
    excerpt: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.literal('Rodrigo Valdelvira'),
    authorId: z.literal('rodrigo-valdelvira'),
    status: z.literal('published'),
    readingMinutes: z.number().int().positive(),
  }),
});

export const collections = { bitacora };
