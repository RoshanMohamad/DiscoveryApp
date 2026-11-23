import { mapCountries, mapCountry } from './mappers';
import type { RawCountry } from './types';

const rawLka: RawCountry = {
  names: {
    common: 'Sri Lanka',
    official: 'Democratic Socialist Republic of Sri Lanka',
  },
  codes: { alpha_3: 'lka' },
  capitals: [{ name: 'Sri Jayawardenepura Kotte' }],
  region: 'Asia',
  subregion: 'Southern Asia',
  population: 21919000,
  area: { kilometers: 65610 },
  flag: { emoji: '🇱🇰', url_png: 'https://flags.example/lk.png' },
  currencies: [{ code: 'LKR', name: 'Sri Lankan rupee', symbol: 'Rs' }],
  languages: [{ name: 'Sinhala' }, { name: 'Tamil' }],
  borders: [],
};

describe('mapCountry', () => {
  it('maps a full record into the app model', () => {
    expect(mapCountry(rawLka)).toEqual({
      code: 'LKA',
      name: 'Sri Lanka',
      officialName: 'Democratic Socialist Republic of Sri Lanka',
      flagEmoji: '🇱🇰',
      flagUrl: 'https://flags.example/lk.png',
      capital: 'Sri Jayawardenepura Kotte',
      region: 'Asia',
      subregion: 'Southern Asia',
      population: 21919000,
      areaKm2: 65610,
      currencies: ['Sri Lankan rupee (Rs)'],
      languages: ['Sinhala', 'Tamil'],
      borders: [],
    });
  });

  it('survives a minimal record with safe defaults', () => {
    const country = mapCountry({
      names: { common: 'Nowhere' },
      codes: { alpha_3: 'NWH' },
    });
    expect(country).toMatchObject({
      code: 'NWH',
      officialName: 'Nowhere',
      flagEmoji: '',
      flagUrl: null,
      capital: null,
      region: 'Other',
      population: null,
      currencies: [],
    });
  });

  it('returns null when the code or name is missing/invalid', () => {
    expect(mapCountry({ names: { common: 'X' } })).toBeNull();
    expect(mapCountry({ codes: { alpha_3: 'XXX' } })).toBeNull();
    expect(
      mapCountry({ names: { common: 'X' }, codes: { alpha_3: 'XX' } }),
    ).toBeNull();
  });
});

describe('mapCountries', () => {
  it('drops unusable records and sorts A-Z', () => {
    const result = mapCountries([
      { names: { common: 'Zambia' }, codes: { alpha_3: 'ZMB' } },
      {},
      { names: { common: 'Albania' }, codes: { alpha_3: 'ALB' } },
    ]);
    expect(result.map(c => c.code)).toEqual(['ALB', 'ZMB']);
  });
});
