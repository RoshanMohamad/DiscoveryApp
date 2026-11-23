import { api } from '../../app/api';
import { AUTH_BASE_URL, ACCESS_TOKEN_MINUTES } from '../../app/config';
import { getTokens, saveTokens } from './services/tokenStorage';

/** API paths live here, not inline (no magic strings). */
const AUTH_PATHS = {
  login: '/auth/login',
  me: '/auth/me',
  register: '/users/add',
  refresh: '/auth/refresh',
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
  image?: string;
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
  image?: string;
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
    /**
     * Current user. The token is read from the Keychain here, NOT passed as an
     * argument, so it never ends up in the Redux/RTK Query cache.
     */
    me: build.query<MeResponse, void>({
      keepUnusedDataFor: 0,
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        const tokens = await getTokens();
        if (!tokens) {
          return { error: { status: 401, data: { message: 'No session' } } };
        }
        const result = await baseQuery({
          url: `${AUTH_BASE_URL}${AUTH_PATHS.me}`,
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        return result.error
          ? { error: result.error }
          : { data: result.data as MeResponse };
      },
    }),
    /** Swaps the stored refresh token for a new pair and saves it (Keychain only). */
    refresh: build.mutation<null, void>({
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        const tokens = await getTokens();
        if (!tokens) {
          return { error: { status: 401, data: { message: 'No session' } } };
        }
        const result = await baseQuery({
          url: `${AUTH_BASE_URL}${AUTH_PATHS.refresh}`,
          method: 'POST',
          body: {
            refreshToken: tokens.refreshToken,
            expiresInMins: ACCESS_TOKEN_MINUTES,
          },
        });
        if (result.error) {
          return { error: result.error };
        }
        const next = result.data as {
          accessToken?: string;
          refreshToken?: string;
        };
        if (!next.accessToken || !next.refreshToken) {
          return { error: { status: 401, data: { message: 'Bad refresh' } } };
        }
        await saveTokens({
          accessToken: next.accessToken,
          refreshToken: next.refreshToken,
        });
        return { data: null };
      },
    }),
  }),
});

export const { useRegisterMutation } = authApi;
