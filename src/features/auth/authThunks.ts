import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../app/api';
import { ACCESS_TOKEN_MINUTES } from '../../app/config';
import { getErrorMessage } from '../../shared/utils/errors';
import { pendingLinkCleared } from '../share/pendingLinkSlice';
import { authApi } from './authApi';
import {
  restoreFinished,
  signedIn,
  signedOut,
  type AuthUser,
} from './authSlice';
import type { LoginValues } from './schemas';
import { clearTokens, getTokens, saveTokens } from './services/tokenStorage';

/**
 * Login flow in one place: call the API, store tokens in Keychain, then put
 * the (non-secret) profile in Redux. If any step fails the user stays signed
 * out and gets a readable message.
 */
export const signIn = createAsyncThunk<
  AuthUser,
  LoginValues,
  { rejectValue: string }
>('auth/signIn', async (values, { dispatch, rejectWithValue }) => {
  try {
    // track:false keeps the response (it holds the tokens) out of the Redux store.
    const result = await dispatch(
      authApi.endpoints.login.initiate(
        { ...values, expiresInMins: ACCESS_TOKEN_MINUTES },
        { track: false },
      ),
    ).unwrap();

    await saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    const user: AuthUser = {
      id: result.id,
      username: result.username,
      firstName: result.firstName,
      lastName: result.lastName,
    };
    dispatch(signedIn(user));
    return user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/** A 4xx from the server means "this token is no good", unlike a network blip. */
const isRejected = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  typeof error.status === 'number' &&
  error.status >= 400 &&
  error.status < 500;

/**
 * Runs once at launch: Keychain token -> GET /auth/me. If the access token
 * expired, try one refresh. A rejected session is wiped; a network failure
 * keeps the tokens so the next launch can try again. Always ends by clearing
 * `isRestoring` so the app never hangs on the splash screen.
 */
export const restoreSession = createAsyncThunk<void, void>(
  'auth/restoreSession',
  async (_arg, { dispatch }) => {
    const fetchMe = () =>
      dispatch(
        authApi.endpoints.me.initiate(undefined, { forceRefetch: true }),
      ).unwrap();

    try {
      if (!(await getTokens())) {
        return;
      }
      let me;
      try {
        me = await fetchMe();
      } catch (error) {
        if (!isRejected(error)) {
          throw error;
        }
        await dispatch(
          authApi.endpoints.refresh.initiate(undefined, { track: false }),
        ).unwrap();
        me = await fetchMe();
      }
      dispatch(
        signedIn({
          id: me.id,
          username: me.username,
          firstName: me.firstName,
          lastName: me.lastName,
        }),
      );
    } catch (error) {
      if (isRejected(error)) {
        await clearTokens();
      }
    } finally {
      dispatch(restoreFinished());
    }
  },
);

/** Logout = clear Keychain + reset auth + drop pending link + reset the RTK Query cache. */
export const signOut = createAsyncThunk<void, void>(
  'auth/signOut',
  async (_arg, { dispatch }) => {
    try {
      await clearTokens();
    } finally {
      // Even if the Keychain call fails the user must end up signed out in the UI.
      dispatch(signedOut());
      dispatch(pendingLinkCleared());
      dispatch(api.util.resetApiState());
    }
  },
);
