import * as z from 'zod';

export const PasswordSchema = z
  .string()
  .min(8, 'password must be at least 8 characters long')
  .max(24, 'password must be at most 24 characters long')
  .regex(/[a-z]/, 'password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'password must contain at least one special character'
  );

export type Password = z.output<typeof PasswordSchema>;
