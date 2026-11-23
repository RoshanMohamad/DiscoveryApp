import { makeTestStore } from '../../test/makeTestStore';
import { mockFetch } from '../../test/mockFetch';
import { countriesApi, MISSING_KEY_MESSAGE } from './countriesApi';
import { getErrorMessage } from '../../shared/utils/errors';

// No key in .env (or still the placeholder): config resolves it to null.
jest.mock('../../app/config', () => ({
  AUTH_BASE_URL: 'https://auth.test',
  ACCESS_TOKEN_MINUTES: 60,
  COUNTRIES_BASE_URL: 'https://countries.test/v5',
  COUNTRIES_API_KEY: null,
}));

describe('countries API without a key', () => {
  it('fails fast with a readable message and sends no request', async () => {
    const { fn } = mockFetch([]);
    const store = makeTestStore();

    const list = await store.dispatch(
      countriesApi.endpoints.getCountries.initiate(),
    );
    const one = await store.dispatch(
      countriesApi.endpoints.getCountry.initiate('LKA'),
    );

    expect(fn).not.toHaveBeenCalled();
    expect(getErrorMessage(list.error)).toBe(MISSING_KEY_MESSAGE);
    expect(getErrorMessage(one.error)).toBe(MISSING_KEY_MESSAGE);
  });
});
