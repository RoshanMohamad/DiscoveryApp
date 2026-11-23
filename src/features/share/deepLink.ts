import { normalizeCountryCode } from '../../shared/utils/countryCode';

export const LINK_SCHEME = 'passport';
export const LINK_PREFIX = `${LINK_SCHEME}://`;
export const COUNTRY_PATH = 'country';

/** passport://country/<ALPHA3>: pure, so it is unit-testable without React Native. */
export const buildCountryLink = (code: string): string => {
  const normalized = normalizeCountryCode(code);
  if (!normalized) {
    throw new RangeError(`Invalid country code: "${code}"`);
  }
  return `${LINK_PREFIX}${COUNTRY_PATH}/${normalized}`;
};

// scheme://country/<segment>, optional trailing slash, optional ?query / #hash.
const COUNTRY_LINK = new RegExp(
  `^${LINK_SCHEME}://${COUNTRY_PATH}/([^/?#]+)/?(?:[?#].*)?$`,
  'i',
);

/** Returns the upper-cased alpha-3 code, or null for anything that is not a valid country link. */
export const parseCountryLink = (
  url: string | null | undefined,
): string | null => {
  if (!url) {
    return null;
  }
  const match = COUNTRY_LINK.exec(url.trim());
  return match ? normalizeCountryCode(match[1]) : null;
};
