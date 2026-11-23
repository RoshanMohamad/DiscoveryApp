import { formatNumber } from '../../shared/utils/format';
import type { Country } from './types';

/**
 * Builds the "About" paragraph from fields we already have (the API has no
 * free-text description). Pure, so it is unit-testable. Skips any sentence
 * whose data is missing instead of printing "undefined".
 */
export const describeCountry = (country: Country): string => {
  const place = country.subregion ?? country.region;
  const sentences = [
    country.capital
      ? `${country.name} is a country in ${place}, and its capital is ${country.capital}.`
      : `${country.name} is a country in ${place}.`,
  ];
  if (country.population !== null) {
    sentences.push(
      `About ${formatNumber(country.population)} people live there.`,
    );
  }
  if (country.areaKm2 !== null) {
    sentences.push(`It covers ${formatNumber(country.areaKm2)} km².`);
  }
  if (country.languages.length > 0) {
    sentences.push(`Languages spoken include ${country.languages.join(', ')}.`);
  }
  return sentences.join(' ');
};
