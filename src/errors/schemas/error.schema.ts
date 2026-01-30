import { z } from 'zod';

export const errorSchema = z.object({
    type: z.string(),
    title: z.string().default('Internal Server Error'),
    status: z.number().default(500),
    detail: z.string().optional(),
    instance: z.string().optional(),
});

export type ErrorSchema = z.infer<typeof errorSchema>;