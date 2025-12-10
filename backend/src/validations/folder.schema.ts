import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const updateFolderSchema = createFolderSchema.partial();
