import { normalizeCountryCode } from '../../shared/utils/countryCode';
import type { Country, RawCountry } from './types';

const UNKNOWN_REGION = 'Other';

const nonEmpty = (values: (string | undefined)[]): string[] =>
  values.filter((v): v is string => typeof v === 'string' && v.length > 0);

/**
 * The ONLY place raw API data becomes an app model. Returns null for records
 * we cannot identify (no valid code or name) so they are dropped, not crashed on.
 */
export const mapCountry = (raw: RawCountry): Country | null => {
  const code = normalizeCountryCode(raw.codes?.alpha_3);
  const name = raw.names?.common;
  if (!code || !name) {
    return null;
  }
  return {
    code,
    name,
    officialName: raw.names?.official ?? name,
    flagEmoji: raw.flag?.emoji ?? '',
    flagUrl: raw.flag?.url_png ?? null,
    capital: raw.capitals?.[0]?.name ?? null,
    region: raw.region || UNKNOWN_REGION,
    subregion: raw.subregion || null,
    population: typeof raw.population === 'number' ? raw.population : null,
    areaKm2:
      typeof raw.area?.kilometers === 'number' ? raw.area.kilometers : null,
    currencies: nonEmpty(
      (raw.currencies ?? []).map(c =>
        c.name ? `${c.name}${c.symbol ? ` (${c.symbol})` : ''}` : c.code,
      ),
    ),
    languages: nonEmpty((raw.languages ?? []).map(l => l.name)),
    borders: nonEmpty(raw.borders ?? []),
  };
};

/** Maps a list, drops unusable records and sorts A-Z by name. */
export const mapCountries = (raws: RawCountry[]): Country[] =>
  raws
    .map(mapCountry)
    .filter((c): c is Country => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
