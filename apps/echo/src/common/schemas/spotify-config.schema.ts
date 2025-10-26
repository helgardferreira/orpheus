import * as z from 'zod';

/**
 * Schema for the Spotify API configuration.
 *
 * This schema is used to validate the Spotify API credentials configuration
 * used in the application.
 */
export const SpotifyConfigSchema = z.object({
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
});

export type SpotifyConfig = z.infer<typeof SpotifyConfigSchema>;
