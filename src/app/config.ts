import Config from 'react-native-config';

/** Values come from .env (gitignored) via react-native-config, with safe defaults. */
export const AUTH_BASE_URL = Config.AUTH_BASE_URL ?? 'https://dummyjson.com';

/** DummyJSON access-token lifetime we request at login. */
export const ACCESS_TOKEN_MINUTES = 60;
