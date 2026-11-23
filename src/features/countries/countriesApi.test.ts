import { makeTestStore } from '../../test/makeTestStore';
import { mockFetch } from '../../test/mockFetch';
import { countriesApi } from './countriesApi';

jest.mock('../../app/config', () => ({
  AUTH_BASE_URL: 'https://auth.test',
  ACCESS_TOKEN_MINUTES: 60,
  COUNTRIES_BASE_URL: 'https://countries.test/v5',
  COUNTRIES_API_KEY: 'test-key',
}));

const page = (names: [string, string][], more: boolean) => ({
  body: {
    data: {
      objects: names.map(([name, code]) => ({
        names: { common: name },
        codes: { alpha_3: code },
        region: 'Asia',
      })),
      meta: { more },
    },
  },
});

describe('getCountries', () => {
  it('walks every page, sends the key and only asks for needed fields', async () => {
    const { requests } = mockFetch([
      page([['Sri Lanka', 'LKA']], true),
      page([['Japan', 'JPN']], false),
    ]);
    const store = makeTestStore();

    const result = await store.dispatch(
      countriesApi.endpoints.getCountries.initiate(),
    );

    expect(requests).toHaveLength(2);
    const first = new URL(requests[0].url);
    const second = new URL(requests[1].url);
    expect(first.origin + first.pathname).toBe('https://countries.test/v5');
    expect(first.searchParams.get('offset')).toBe('0');
    expect(second.searchParams.get('offset')).toBe('100');
    expect(first.searchParams.get('limit')).toBe('100');
    expect(first.searchParams.get('response_fields')).toContain('flag.url_png');
    expect(requests[0].headers.get('authorization')).toBe('Bearer test-key');
    // Mapped to the app model and sorted A-Z.
    expect(result.data?.map(c => c.code)).toEqual(['JPN', 'LKA']);
  });

  it('is cached: a second subscriber does not hit the network', async () => {
    const { fn } = mockFetch([page([['Japan', 'JPN']], false)]);
    const store = makeTestStore();
    await store.dispatch(countriesApi.endpoints.getCountries.initiate());
    await store.dispatch(countriesApi.endpoints.getCountries.initiate());
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('surfaces a server error', async () => {
    mockFetch([{ status: 500, body: { errors: [{ message: 'down' }] } }]);
    const store = makeTestStore();
    const result = await store.dispatch(
      countriesApi.endpoints.getCountries.initiate(),
    );
    expect(result.isError).toBe(true);
    expect(result.error).toMatchObject({ status: 500 });
  });
});

describe('getCountry', () => {
  it('reads one country by alpha-3 code', async () => {
    const { requests } = mockFetch([page([['Sri Lanka', 'LKA']], false)]);
    const store = makeTestStore();
    const result = await store.dispatch(
      countriesApi.endpoints.getCountry.initiate('lka'),
    );
    expect(new URL(requests[0].url).pathname).toBe('/v5/codes.alpha_3/LKA');
    expect(result.data?.name).toBe('Sri Lanka');
  });

  it('never calls the API for an invalid code', async () => {
    const { fn } = mockFetch([]);
    const store = makeTestStore();
    const result = await store.dispatch(
      countriesApi.endpoints.getCountry.initiate('NOT-A-CODE'),
    );
    expect(fn).not.toHaveBeenCalled();
    expect(result.error).toMatchObject({ status: 404 });
  });

  it('treats an empty result (unknown code) as not found', async () => {
    mockFetch([{ body: { data: { objects: [], meta: { more: false } } } }]);
    const store = makeTestStore();
    const result = await store.dispatch(
      countriesApi.endpoints.getCountry.initiate('ZZZ'),
    );
    expect(result.error).toMatchObject({ status: 404 });
  });

  it('reports a network failure', async () => {
    mockFetch([new TypeError('Network request failed')]);
    const store = makeTestStore();
    const result = await store.dispatch(
      countriesApi.endpoints.getCountry.initiate('LKA'),
    );
    expect(result.error).toMatchObject({ status: 'FETCH_ERROR' });
  });
});
