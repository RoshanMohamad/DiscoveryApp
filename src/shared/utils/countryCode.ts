const ALPHA3 = /^[A-Za-z]{3}$/;

/**
 * Returns the upper-cased ISO alpha-3 code, or null if `raw` is not one.
 * Used before ANY API call or navigation so bad codes never reach the server
 * (4xx responses count against the REST Countries quota).
 */
export const normalizeCountryCode = (raw: unknown): string | null =>
  typeof raw === 'string' && ALPHA3.test(raw.trim())
    ? raw.trim().toUpperCase()
    : null;
