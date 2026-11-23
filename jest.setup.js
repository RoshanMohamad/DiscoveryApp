/* eslint-env jest */
// Native modules don't exist under Jest, so replace them with in-memory fakes.
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: { AUTH_BASE_URL: 'https://dummyjson.com' },
}));

// Safe-area insets come from native code; the package ships a Jest mock.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-keychain', () => {
  let stored = false;
  return {
    setGenericPassword: jest.fn(async (username, password) => {
      stored = { username, password, service: 'test' };
      return stored;
    }),
    getGenericPassword: jest.fn(async () => stored),
    resetGenericPassword: jest.fn(async () => {
      stored = false;
      return true;
    }),
  };
});

jest.mock('react-native-mmkv', () => {
  const data = new Map();
  return {
    createMMKV: () => ({
      set: (key, value) => data.set(key, value),
      getString: key => data.get(key),
      remove: key => data.delete(key),
    }),
  };
});
