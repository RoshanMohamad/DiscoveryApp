import {
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';

/** Tokens are secrets: they live ONLY in the OS Keychain/Keystore. */
const KEYCHAIN_SERVICE = 'passport.auth.tokens';
const KEYCHAIN_USERNAME = 'tokens';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const saveTokens = async (tokens: AuthTokens): Promise<void> => {
  await setGenericPassword(KEYCHAIN_USERNAME, JSON.stringify(tokens), {
    service: KEYCHAIN_SERVICE,
  });
};

export const getTokens = async (): Promise<AuthTokens | null> => {
  const entry = await getGenericPassword({ service: KEYCHAIN_SERVICE });
  if (!entry) {
    return null;
  }
  try {
    const parsed: Partial<AuthTokens> = JSON.parse(entry.password);
    if (parsed.accessToken && parsed.refreshToken) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    }
  } catch {
    // Corrupt entry: treat as "no session".
  }
  return null;
};

export const clearTokens = async (): Promise<void> => {
  await resetGenericPassword({ service: KEYCHAIN_SERVICE });
};
