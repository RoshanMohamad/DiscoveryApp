import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * One shared RTK Query API. Each feature adds its endpoints with
 * `api.injectEndpoints(...)`, so there is a single cache and a single
 * `resetApiState()` on logout. Endpoints pass absolute URLs because auth and
 * countries live on different hosts.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: () => ({}),
});
