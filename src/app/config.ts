import Config from 'react-native-config';

/** Values come from .env (gitignored) via react-native-config, with safe defaults. */
export const AUTH_BASE_URL = Config.AUTH_BASE_URL ?? 'https://dummyjson.com';

/** DummyJSON access-token lifetime we request at login. */
export const ACCESS_TOKEN_MINUTES = 60;

export const COUNTRIES_BASE_URL = 'https://api.restcountries.com/countries/v5';

/** null when .env lacks the key or still has the `.env.example` placeholder. */
const RAW_COUNTRIES_KEY = Config.REST_COUNTRIES_API_KEY ?? '';
export const COUNTRIES_API_KEY =
  RAW_COUNTRIES_KEY && RAW_COUNTRIES_KEY !== 'your_key_here'
    ? RAW_COUNTRIES_KEY
    : null;
