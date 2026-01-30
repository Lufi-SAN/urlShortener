import { z } from 'zod';

export const errorDataSchema = z.object({
    type: z.string().default('#'),
    title: z.string().default('Internal Server Error'),
    status: z.number().default(500),
    detail: z.string().default('An unexpected error occurred on the server.'),
    instance: z.string(),
});

export type ErrorDataSchema = z.infer<typeof errorDataSchema>;