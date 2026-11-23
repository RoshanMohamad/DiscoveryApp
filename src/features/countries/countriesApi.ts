import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { api } from '../../app/api';
import { COUNTRIES_API_KEY, COUNTRIES_BASE_URL } from '../../app/config';
import { normalizeCountryCode } from '../../shared/utils/countryCode';
import { mapCountries, mapCountry } from './mappers';
import type { Country, RawCountriesResponse } from './types';

/** API paths and params live here, not inline (no magic strings). */
const PATHS = {
  list: '',
  byAlpha3: '/codes.alpha_3',
} as const;

/** Ask only for what we show: smaller payloads, and the free tier is limited. */
const LIST_FIELDS = [
  'names.common',
  'codes.alpha_3',
  'capitals',
  'region',
  'population',
  'flag.emoji',
  'flag.url_png',
].join(',');

const DETAIL_FIELDS = [
  'names.common',
  'names.official',
  'codes.alpha_3',
  'capitals',
  'region',
  'subregion',
  'population',
  'area.kilometers',
  'flag.emoji',
  'flag.url_png',
  'currencies',
  'languages',
  'borders',
].join(',');

/** Free plan allows 1-100 per page; the dataset has ~250 countries. */
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/** Countries rarely change: keep them a day and never refetch on focus. */
const ONE_DAY_SECONDS = 24 * 60 * 60;

export const MISSING_KEY_MESSAGE =
  'Countries API key is missing. Add REST_COUNTRIES_API_KEY to .env and rebuild.';

const customError = (message: string): FetchBaseQueryError => ({
  status: 'CUSTOM_ERROR',
  error: message,
});

const authHeaders = (key: string) => ({ Authorization: `Bearer ${key}` });

export const countriesApi = api.injectEndpoints({
  endpoints: build => ({
    getCountries: build.query<Country[], void>({
      keepUnusedDataFor: ONE_DAY_SECONDS,
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        if (!COUNTRIES_API_KEY) {
          return { error: customError(MISSING_KEY_MESSAGE) };
        }
        const raws: NonNullable<
          NonNullable<RawCountriesResponse['data']>['objects']
        > = [];
        for (let page = 0; page < MAX_PAGES; page += 1) {
          const result = await baseQuery({
            url: `${COUNTRIES_BASE_URL}${PATHS.list}`,
            headers: authHeaders(COUNTRIES_API_KEY),
            params: {
              response_fields: LIST_FIELDS,
              limit: PAGE_SIZE,
              offset: page * PAGE_SIZE,
            },
          });
          if (result.error) {
            return { error: result.error };
          }
          const body = result.data as RawCountriesResponse;
          raws.push(...(body.data?.objects ?? []));
          if (!body.data?.meta?.more) {
            break;
          }
        }
        return { data: mapCountries(raws) };
      },
    }),

    /** Receives ONLY the code; the code is validated before any request. */
    getCountry: build.query<Country, string>({
      keepUnusedDataFor: ONE_DAY_SECONDS,
      queryFn: async (rawCode, _api, _extra, baseQuery) => {
        const code = normalizeCountryCode(rawCode);
        if (!code) {
          return {
            error: { status: 404, data: { message: 'Unknown country code.' } },
          };
        }
        if (!COUNTRIES_API_KEY) {
          return { error: customError(MISSING_KEY_MESSAGE) };
        }
        const result = await baseQuery({
          url: `${COUNTRIES_BASE_URL}${PATHS.byAlpha3}/${code}`,
          headers: authHeaders(COUNTRIES_API_KEY),
          params: { response_fields: DETAIL_FIELDS },
        });
        if (result.error) {
          return { error: result.error };
        }
        const body = result.data as RawCountriesResponse;
        // An unknown code is a 200 with an empty list, not a 404.
        const raw = body.data?.objects?.[0];
        const country = raw ? mapCountry(raw) : null;
        if (!country) {
          return {
            error: { status: 404, data: { message: 'Country not found.' } },
          };
        }
        return { data: country };
      },
    }),
  }),
});

export const { useGetCountriesQuery, useGetCountryQuery } = countriesApi;
