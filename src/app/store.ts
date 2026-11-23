import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { api } from './api';
import { mmkvStorage } from './persistence';
import { rootReducer } from './rootReducer';

/**
 * Only favourites, theme and the "intro seen" flag survive a restart. Auth is deliberately NOT here
 * (the session is restored from the Keychain token) and the RTK Query cache
 * and pending link are rebuilt fresh.
 */
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: mmkvStorage,
    whitelist: ['favourites', 'theme', 'onboarding'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefault =>
    getDefault({
      // redux-persist actions carry functions; they are safe to ignore.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
