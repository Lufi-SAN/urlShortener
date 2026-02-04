import { z } from 'zod';

export const errorDataSchema = z.object({
    type: z.string(),
    title: z.string(),
    status: z.number(),
    detail: z.string(),
    instance: z.string(),
});

export type ErrorDataSchema = z.infer<typeof errorDataSchema>;