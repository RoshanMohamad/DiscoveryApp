import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
import { favouritesReducer } from '../features/favourites/favouritesSlice';
import { pendingLinkReducer } from '../features/share/pendingLinkSlice';
import { themeReducer } from '../features/settings/themeSlice';
import { api } from './api';

/** Kept separate from store.ts so tests can reuse it without starting redux-persist. */
export const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
  theme: themeReducer,
  pendingLink: pendingLinkReducer,
  [api.reducerPath]: api.reducer,
});
