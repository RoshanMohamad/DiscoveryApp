import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
};

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = { user: null };

/** Minimal for now: real login/session restore arrives in the auth commits. */
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
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.user !== null;
