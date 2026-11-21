import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_MINUTES } from '../../app/config';
import { getErrorMessage } from '../../shared/utils/errors';
import { authApi } from './authApi';
import { signedIn, type AuthUser } from './authSlice';
import type { LoginValues } from './schemas';
import { saveTokens } from './services/tokenStorage';

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
    const result = await dispatch(
      authApi.endpoints.login.initiate({
        ...values,
        expiresInMins: ACCESS_TOKEN_MINUTES,
      }),
    ).unwrap();

    await saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    const user: AuthUser = {
      id: result.id,
      username: result.username,
      firstName: result.firstName,
    };
    dispatch(signedIn(user));
    return user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
