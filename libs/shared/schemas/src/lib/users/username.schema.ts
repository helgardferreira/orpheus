import * as z from 'zod';

export const UsernameSchema = z
  .string()
  .min(3, 'username must be at least 3 characters long')
  .max(20, 'username must be at most 20 characters long')
  .regex(
    /^[A-Za-z][A-Za-z0-9._]*$/,
    'username must start with a letter and contain only letters, numbers, underscores, or dots'
  );

export type Username = z.output<typeof UsernameSchema>;
