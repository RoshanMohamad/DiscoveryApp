/* eslint-env jest */
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../app/api';
import { rootReducer } from '../app/store';

const buildStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefault => getDefault().concat(api.middleware),
  });

export type TestStore = ReturnType<typeof buildStore>;

const created: TestStore[] = [];

/** Real reducers + RTK Query middleware, but no redux-persist, so tests start clean. */
export const makeTestStore = (): TestStore => {
  const store = buildStore();
  created.push(store);
  return store;
};

// RTK Query schedules cache-removal timers; reset them so Jest can exit cleanly.
afterEach(() => {
  created.splice(0).forEach(store => store.dispatch(api.util.resetApiState()));
});
