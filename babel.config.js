module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // zod v4 ships `export * as core from './core/index.js'`, which Metro will not
  // transform unless this plugin runs first.
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
