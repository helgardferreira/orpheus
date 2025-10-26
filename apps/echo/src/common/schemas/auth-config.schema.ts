import * as z from 'zod';

import { stringToInt } from '@orpheus/schemas';

/**
 * Schema for Auth configuration.
 *
 * This schema is used to validate the Auth configuration used in the
 * application.
 */
export const AuthConfigSchema = z.object({
  HASH_SALT_ROUNDS: stringToInt,
  JWT_EXPIRES_IN: stringToInt,
  JWT_SECRET: z.string().min(1),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;
