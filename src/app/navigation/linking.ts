import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import {
  COUNTRY_PATH,
  LINK_PREFIX,
  parseCountryLink,
} from '../../features/share/deepLink';
import { ROUTES } from './routes';
import type { RootStackParamList } from './types';

type LinkGate = {
  isAuthenticated: () => boolean;
  /** Called with the country code of a link that arrived while logged out. */
  onPendingCode: (code: string) => void;
};

/**
 * Auth gate for links. Logged in: pass the URL on so React Navigation opens it.
 * Logged out: the target screens do not exist yet, so remember the country
 * code instead and return null (navigation ignores it). After login the root
 * navigator opens the stored code.
 */
export const gateLink = (
  url: string | null | undefined,
  { isAuthenticated, onPendingCode }: LinkGate,
): string | null => {
  if (!url) {
    return null;
  }
  if (isAuthenticated()) {
    return url;
  }
  const code = parseCountryLink(url);
  if (code) {
    onPendingCode(code);
  }
  return null;
};

export const createLinking = (
  gate: LinkGate,
): LinkingOptions<RootStackParamList> => ({
  prefixes: [LINK_PREFIX],
  config: {
    screens: {
      [ROUTES.App]: {
        screens: {
          [ROUTES.HomeTab]: {
            // Keep Home under Details so "back" works after a deep link.
            initialRouteName: ROUTES.Home,
            screens: {
              [ROUTES.CountryDetails]: {
                path: `${COUNTRY_PATH}/:code`,
                // Links may be lower-case: normalise before it becomes a param.
                parse: { code: (code: string) => code.toUpperCase() },
              },
            },
          },
        },
      },
    },
  },
  // Cold start: the app was launched by a link.
  getInitialURL: async () => gateLink(await Linking.getInitialURL(), gate),
  // Warm start: a link arrives while the app is already running.
  subscribe: listener => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const allowed = gateLink(url, gate);
      if (allowed) {
        listener(allowed);
      }
    });
    return () => subscription.remove();
  },
});
