/* eslint-env jest */
// Native modules don't exist under Jest, so replace them with in-memory fakes.
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: { AUTH_BASE_URL: 'https://dummyjson.com' },
}));

// Safe-area insets come from native code; the package ships a Jest mock.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// Gradients, SVG and the clipboard are native views/modules: render plain Views / no-ops.
jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Path: View,
    Circle: View,
    Defs: View,
    LinearGradient: View,
    Stop: View,
  };
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: { setString: jest.fn() },
}));

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
