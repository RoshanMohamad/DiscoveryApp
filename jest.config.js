module.exports = {
  preset: '@react-native/jest-preset',
  // Fonts are native assets; Jest only needs a placeholder value.
  moduleNameMapper: { '\\.ttf$': '<rootDir>/__mocks__/fileMock.js' },
  // react-navigation, react-redux and the Feather icons ship ES modules; let Babel transform them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons|react-redux|@reduxjs|immer|redux|redux-thunk|reselect)/)',
  ],
};
