import { z } from 'zod';

export const userSignUpDataSchema = z.object({
    username: z.string().trim().toLowerCase().min(3, 'Username must be at least 3 characters long').max(128, 'Username must be at most 128 characters long').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string().trim().min(6, 'Password must be at least 6 characters long').max(72, 'Password must be at most 72 characters long'),
});

export type UserSignUpData = z.infer<typeof userSignUpDataSchema>;

