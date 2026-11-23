/**
 * Bundled photos (free Unsplash images, see docs/notes-for-readme.md).
 * One registry, so screens never call require() with a path themselves.
 */
export const images = {
  welcome: require('./welcome-sunset.jpg'),
  night: require('./night-mountains.jpg'),
  santorini: require('./slide-santorini.jpg'),
  lake: require('./slide-lake.jpg'),
  valley: require('./slide-valley.jpg'),
} as const;
