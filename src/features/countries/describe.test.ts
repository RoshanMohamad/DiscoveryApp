import { describeCountry } from './describe';
import type { Country } from './types';

const base: Country = {
  code: 'LKA',
  name: 'Sri Lanka',
  officialName: 'Democratic Socialist Republic of Sri Lanka',
  flagEmoji: '',
  flagUrl: null,
  capital: 'Colombo',
  region: 'Asia',
  subregion: 'Southern Asia',
  population: 21803000,
  areaKm2: 65610,
  currencies: [],
  languages: ['Sinhala', 'Tamil'],
  borders: [],
};

describe('describeCountry', () => {
  it('uses every available field', () => {
    expect(describeCountry(base)).toBe(
      'Sri Lanka is a country in Southern Asia, and its capital is Colombo. ' +
        'About 21,803,000 people live there. It covers 65,610 km². ' +
        'Languages spoken include Sinhala, Tamil.',
    );
  });

  it('falls back to the region and skips missing data', () => {
    const text = describeCountry({
      ...base,
      subregion: null,
      capital: null,
      population: null,
      areaKm2: null,
      languages: [],
    });
    expect(text).toBe('Sri Lanka is a country in Asia.');
    expect(text).not.toMatch(/undefined|null/);
  });
});
