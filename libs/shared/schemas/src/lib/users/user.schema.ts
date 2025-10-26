import * as z from 'zod';

import { epochMillisToDate } from '../utils/codecs/index.js';

import { PasswordSchema } from './password.schema.js';
import { UsernameSchema } from './username.schema.js';

const AccessTokenSchema = z.object({
  accessToken: z.string(),
});

const SignInUserSchema = z.object({
  password: z.string(),
  username: z.string(),
});

const SignUpUserSchema = z
  .object({
    confirmPassword: z.string(),
    password: PasswordSchema,
    username: UsernameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const UpdateUserWithoutPassword = z.object({
  confirmPassword: z.undefined().optional(),
  password: z.undefined().optional(),
  previousPassword: z.undefined().optional(),
  username: UsernameSchema.optional(),
});

const UpdateUserWithPassword = z
  .object({
    confirmPassword: z.string(),
    password: PasswordSchema,
    previousPassword: z.string(),
    username: UsernameSchema.optional(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine(({ password, previousPassword }) => password !== previousPassword, {
    path: ['password'],
    message: 'New password must differ from previous password',
  });

const UpdateUserSchema = z.union([
  UpdateUserWithoutPassword,
  UpdateUserWithPassword,
]);

// TODO: figure out easiest, and then best, way to enrich user with spotify user metadata
// TODO: update this with more relevant data after investigating:
//       - Spotify Web API
//       - Spotify Web Playback SDK
// TODO: continue here...
const UserSchema = z.object({
  createdAt: epochMillisToDate,
  id: z.uuid(),
  password: z.string().min(8).max(24),
  updatedAt: epochMillisToDate,
  username: z.string().min(3).max(20),
});

const UserSessionSchema = z.object({
  createdAt: epochMillisToDate,
  id: z.uuid(),
  updatedAt: epochMillisToDate,
  username: z.string().min(3).max(20),
});

export {
  AccessTokenSchema,
  SignInUserSchema,
  SignUpUserSchema,
  UpdateUserSchema,
  UserSchema,
  UserSessionSchema,
};

type AccessToken = z.output<typeof AccessTokenSchema>;
type SignInUser = z.output<typeof SignInUserSchema>;
type SignUpUser = z.output<typeof SignUpUserSchema>;
type UpdateUser = z.output<typeof UpdateUserSchema>;
type User = z.output<typeof UserSchema>;
type UserSession = z.output<typeof UserSessionSchema>;

export type {
  AccessToken,
  SignInUser,
  SignUpUser,
  UpdateUser,
  User,
  UserSession,
};
