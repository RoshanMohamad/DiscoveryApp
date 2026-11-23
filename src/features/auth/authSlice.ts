import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  /** Avatar URL from DummyJSON (not secret). */
  image?: string;
};

export type AuthState = {
  user: AuthUser | null;
  /** True until the launch-time session check (Keychain + /auth/me) finishes. */
  isRestoring: boolean;
};

const initialState: AuthState = { user: null, isRestoring: true };

/** Profile only (not secret). Tokens live in the Keychain, never here. */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    signedOut: state => {
      state.user = null;
    },
    restoreFinished: state => {
      state.isRestoring = false;
    },
  },
});

export const { signedIn, signedOut, restoreFinished } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.user !== null;
export const selectIsRestoring = (state: { auth: AuthState }) =>
  state.auth.isRestoring;
