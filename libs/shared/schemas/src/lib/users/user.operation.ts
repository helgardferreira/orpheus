import {
  type AccessToken,
  AccessTokenSchema,
  type SignInUser,
  SignInUserSchema,
  type SignUpUser,
  SignUpUserSchema,
  type UpdateUser,
  UpdateUserSchema,
  type UserSession,
  UserSessionSchema,
} from './user.schema.js';

const deleteUser = async (accessToken: string): Promise<void> => {
  const res = await fetch(`/api/users/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

const findUser = async (accessToken: string): Promise<UserSession> => {
  const res = await fetch(`/api/users/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
  const data: any = await res.json();

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return UserSessionSchema.decode(data);
};

const signInUser = async (data: SignInUser): Promise<AccessToken> => {
  const body = JSON.stringify(SignInUserSchema.encode(data));

  const res = await fetch('/api/auth/sign-in', {
    body,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
  });
  const encoded: any = await res.json();

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return AccessTokenSchema.decode(encoded);
};

const signUpUser = async (data: SignUpUser): Promise<AccessToken> => {
  const body = JSON.stringify(SignUpUserSchema.encode(data));

  const res = await fetch('/api/auth/sign-up', {
    body,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
  });
  const encoded: any = await res.json();

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return AccessTokenSchema.decode(encoded);
};

const updateUser = async (
  data: UpdateUser,
  accessToken: string
): Promise<UserSession> => {
  const body = JSON.stringify(UpdateUserSchema.encode(data));

  const res = await fetch(`/api/users/me`, {
    body,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'PATCH',
  });
  const encoded: any = await res.json();

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return UserSessionSchema.decode(encoded);
};

export { deleteUser, findUser, signInUser, signUpUser, updateUser };
