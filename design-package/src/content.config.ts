import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(), subtitle: z.string(), date: z.string(),
    status: z.literal('draft'), source: z.url(),
    sourceLabel: z.string(), illustration: z.enum(['chat', 'sql', 'probe']),
  }),
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/notes' }),
  schema: z.object({ title: z.string(), date: z.string(), summary: z.string(), url: z.url(), order: z.number() }),
});
export const collections = { work, notes };
