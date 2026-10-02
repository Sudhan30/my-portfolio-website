import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(), subtitle: z.string(), date: z.string(),
    status: z.literal('draft'), source: z.url().optional(),
    sourceLabel: z.string(), illustration: z.enum(['chat', 'sql', 'probe', 'agents', 'identity', 'pipeline']),
    group: z.enum(['professional', 'personal']), order: z.number(),
    summary: z.string(), decision: z.string(), category: z.string(),
    evidenceLabel: z.string(), evidenceNote: z.string(), caption: z.string(),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  }),
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/notes' }),
  schema: z.object({ title: z.string(), date: z.string(), summary: z.string(), url: z.url(), order: z.number() }),
});
const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: z.object({ company: z.string(), role: z.string(), period: z.string(), order: z.number(), summary: z.string(), chapter: z.string() }),
});
export const collections = { work, notes, experience };
