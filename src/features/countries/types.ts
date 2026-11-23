/** Raw REST Countries v5 shapes (only the fields we request). All optional: never trust the wire. */
export type RawCountry = {
  names?: { common?: string; official?: string };
  codes?: { alpha_2?: string; alpha_3?: string };
  capitals?: { name?: string }[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: { kilometers?: number };
  flag?: { emoji?: string; url_png?: string };
  currencies?: { code?: string; name?: string; symbol?: string }[];
  languages?: { name?: string }[];
  borders?: string[];
};

export type RawCountriesResponse = {
  data?: {
    objects?: RawCountry[];
    meta?: { total?: number; more?: boolean };
  };
};

/** The app's own model. UI never sees RawCountry. */
export type Country = {
  /** ISO alpha-3, e.g. "LKA": the item ID everywhere. */
  code: string;
  name: string;
  officialName: string;
  flagEmoji: string;
  flagUrl: string | null;
  capital: string | null;
  region: string;
  subregion: string | null;
  population: number | null;
  areaKm2: number | null;
  currencies: string[];
  languages: string[];
  borders: string[];
};
