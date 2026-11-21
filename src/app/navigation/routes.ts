/** Single source of truth for route names (no magic strings). */
export const ROUTES = {
  // Root
  Auth: 'Auth',
  App: 'App',
  // Auth stack
  Login: 'Login',
  Register: 'Register',
  // Tabs
  HomeTab: 'HomeTab',
  FavouritesTab: 'FavouritesTab',
  ProfileTab: 'ProfileTab',
  // Home stack
  Home: 'Home',
  CountryDetails: 'CountryDetails',
} as const;
