import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { makeTestStore, type TestStore } from './makeTestStore';

/** Renders UI inside a fresh (non-persisted) Redux store and hands the store back. */
export const renderWithStore = async (
  ui: React.ReactElement,
  store: TestStore = makeTestStore(),
) => {
  const utils = await render(<Provider store={store}>{ui}</Provider>);
  return { store, ...utils };
};
