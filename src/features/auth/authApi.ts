import { api } from '../../app/api';
import { AUTH_BASE_URL } from '../../app/config';

/** API paths live here, not inline (no magic strings). */
const AUTH_PATHS = {
  login: '/auth/login',
  me: '/auth/me',
  register: '/users/add',
} as const;

export type LoginRequest = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type MeResponse = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: `${AUTH_BASE_URL}${AUTH_PATHS.login}`,
        method: 'POST',
        body,
      }),
    }),
    /** DummyJSON registration is simulated: it returns a fake user only. */
    register: build.mutation<{ id: number }, RegisterRequest>({
      query: body => ({
        url: `${AUTH_BASE_URL}${AUTH_PATHS.register}`,
        method: 'POST',
        body,
      }),
    }),
    me: build.query<MeResponse, string>({
      query: accessToken => ({
        url: `${AUTH_BASE_URL}${AUTH_PATHS.me}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
