import * as z from 'zod';

import { AuthConfigSchema } from './auth-config.schema';
import { PersistenceConfigSchema } from './persistence-config.schema';
import { SpotifyConfigSchema } from './spotify-config.schema';

/**
 * Schema for environment variables.
 *
 * This schema is used to validate the environment variables used in the
 * application.
 */
export const ConfigSchema = z.object({
  ...AuthConfigSchema.shape,
  ...PersistenceConfigSchema.shape,
  ...SpotifyConfigSchema.shape,
});

export type Config = z.infer<typeof ConfigSchema>;
