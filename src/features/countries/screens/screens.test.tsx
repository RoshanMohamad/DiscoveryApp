import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { makeTestStore } from '../../../test/makeTestStore';
import { mockFetch } from '../../../test/mockFetch';
import { renderWithStore } from '../../../test/renderWithStore';
import { favouriteAdded } from '../../favourites/favouritesSlice';
import { FavouritesScreen } from '../../favourites/screens/FavouritesScreen';
import { CountryDetailsScreen } from './CountryDetailsScreen';
import { HomeScreen } from './HomeScreen';

jest.mock('../../../app/config', () => ({
  AUTH_BASE_URL: 'https://auth.test',
  ACCESS_TOKEN_MINUTES: 60,
  COUNTRIES_BASE_URL: 'https://countries.test/v5',
  COUNTRIES_API_KEY: 'test-key',
}));

const country = (
  name: string,
  code: string,
  region: string,
  extra: object = {},
) => ({
  names: { common: name, official: `Republic of ${name}` },
  codes: { alpha_3: code },
  capitals: [{ name: `${name} City` }],
  region,
  population: 1234567,
  flag: { emoji: '🏳', url_png: `https://flags.test/${code}.png` },
  ...extra,
});

const listBody = {
  data: {
    objects: [
      country('Sri Lanka', 'LKA', 'Asia'),
      country('France', 'FRA', 'Europe'),
    ],
    meta: { more: false },
  },
};

// Screens only use navigate/goBack/popTo from navigation, so a stub is enough.
const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  popTo: jest.fn(),
};

const homeProps = {
  navigation,
  route: { key: 'h', name: ROUTES.Home },
} as unknown as HomeStackScreenProps<typeof ROUTES.Home>;

const detailsProps = (code: string) =>
  ({
    navigation,
    route: { key: 'd', name: ROUTES.CountryDetails, params: { code } },
  } as unknown as HomeStackScreenProps<typeof ROUTES.CountryDetails>);

beforeEach(() => jest.clearAllMocks());

describe('HomeScreen', () => {
  it('shows a loading state, then country cards with region / capital / population', async () => {
    mockFetch([{ body: listBody, delayMs: 50 }]);
    await renderWithStore(<HomeScreen {...homeProps} />);

    expect(screen.getByLabelText('Loading countries…')).toBeTruthy();
    expect(await screen.findByText('Sri Lanka')).toBeTruthy();
    expect(screen.getByText('France')).toBeTruthy();
    // The card's accessibility label carries region / capital / population.
    expect(
      screen.getByLabelText(
        'Sri Lanka. Asia · Sri Lanka City · 1,234,567 people',
      ),
    ).toBeTruthy();
  });

  it('greets the signed-in user by first name', async () => {
    mockFetch([{ body: listBody }]);
    const store = makeTestStore();
    store.dispatch({
      type: 'auth/signedIn',
      payload: { id: 1, username: 'e', firstName: 'Emily', lastName: 'J' },
    });
    await renderWithStore(<HomeScreen {...homeProps} />, store);
    expect(await screen.findByText(/Hello, Emily/)).toBeTruthy();
  });

  it('filters by region and opens a country by its code only', async () => {
    mockFetch([{ body: listBody }]);
    await renderWithStore(<HomeScreen {...homeProps} />);
    await screen.findByText('Sri Lanka');

    await fireEvent.press(screen.getByLabelText('Filter by Europe'));
    expect(screen.queryByText('Sri Lanka')).toBeNull();
    expect(screen.getByText('France')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText(/^France\./));
    expect(navigation.navigate).toHaveBeenCalledWith(ROUTES.CountryDetails, {
      code: 'FRA',
    });
  });

  it('searches by country name or capital', async () => {
    mockFetch([{ body: listBody }]);
    await renderWithStore(<HomeScreen {...homeProps} />);
    await screen.findByText('Sri Lanka');

    await fireEvent.changeText(
      screen.getByLabelText('Search countries, capitals...'),
      'france',
    );
    expect(screen.queryByText('Sri Lanka')).toBeNull();
    expect(screen.getByText('France')).toBeTruthy();

    // "Sri Lanka City" is the capital in the fixture.
    await fireEvent.changeText(
      screen.getByLabelText('Search countries, capitals...'),
      'lanka city',
    );
    expect(screen.getByText('Sri Lanka')).toBeTruthy();
    expect(screen.queryByText('France')).toBeNull();

    await fireEvent.changeText(
      screen.getByLabelText('Search countries, capitals...'),
      'zzz',
    );
    expect(await screen.findByText('No countries found')).toBeTruthy();
  });

  it('filters through the region sheet only after Apply Filter', async () => {
    mockFetch([{ body: listBody }]);
    await renderWithStore(<HomeScreen {...homeProps} />);
    await screen.findByText('Sri Lanka');

    await fireEvent.press(screen.getByLabelText('Filter by region'));
    await fireEvent.press(screen.getByLabelText('Region Europe'));
    // Choosing a row alone changes nothing yet.
    expect(screen.getByText('Sri Lanka')).toBeTruthy();

    await fireEvent.press(screen.getByText('Apply Filter'));
    expect(screen.queryByText('Sri Lanka')).toBeNull();
    expect(screen.getByText('France')).toBeTruthy();
  });

  it('shows an error with Retry, and Retry loads the list', async () => {
    const { fn } = mockFetch([
      new TypeError('Network request failed'),
      { body: listBody },
    ]);
    await renderWithStore(<HomeScreen {...homeProps} />);

    expect(
      await screen.findByText(
        'Cannot reach the server. Check your connection.',
      ),
    ).toBeTruthy();

    await fireEvent.press(screen.getByText('Retry'));
    expect(await screen.findByText('Sri Lanka')).toBeTruthy();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('shows an empty state when the API returns no countries', async () => {
    mockFetch([{ body: { data: { objects: [], meta: { more: false } } } }]);
    await renderWithStore(<HomeScreen {...homeProps} />);
    expect(await screen.findByText('No countries found')).toBeTruthy();
  });
});

describe('CountryDetailsScreen', () => {
  it('loads its own data from the code and shows the details', async () => {
    const { requests } = mockFetch([
      {
        body: {
          data: {
            objects: [
              country('Sri Lanka', 'LKA', 'Asia', {
                subregion: 'Southern Asia',
                area: { kilometers: 65610 },
                languages: [{ name: 'Sinhala' }],
              }),
            ],
            meta: { more: false },
          },
        },
      },
    ]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('LKA')} />);

    expect(await screen.findByText('Republic of Sri Lanka')).toBeTruthy();
    // Headline stats are on the Overview tab; languages are on the Facts tab.
    expect(screen.getByText('65,610 km²')).toBeTruthy();
    expect(
      screen.getByText(/Sri Lanka is a country in Southern Asia/),
    ).toBeTruthy();
    expect(screen.queryByText('Sinhala')).toBeNull();

    await fireEvent.press(screen.getByLabelText('Facts'));
    expect(screen.getByText('Sinhala')).toBeTruthy();
    expect(new URL(requests[0].url).pathname).toBe('/v5/codes.alpha_3/LKA');
  });

  it('shows Back, Favourite and Share on the photo once the country has loaded', async () => {
    mockFetch([
      {
        body: {
          data: { objects: [country('Sri Lanka', 'LKA', 'Asia')], meta: {} },
        },
      },
    ]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('LKA')} />);
    await screen.findByText('Republic of Sri Lanka');

    expect(screen.getByLabelText('Share Sri Lanka')).toBeTruthy();
    expect(screen.getByLabelText('Add Sri Lanka to favourites')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Go back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('opens the share sheet with the deep link and a Copy button', async () => {
    mockFetch([
      {
        body: {
          data: { objects: [country('Sri Lanka', 'LKA', 'Asia')], meta: {} },
        },
      },
    ]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('LKA')} />);
    await screen.findByText('Republic of Sri Lanka');

    await fireEvent.press(screen.getByLabelText('Share Sri Lanka'));
    expect(await screen.findByText('Share Country')).toBeTruthy();
    expect(screen.getByText('passport://country/LKA')).toBeTruthy();
    expect(screen.getByLabelText('Share via WhatsApp')).toBeTruthy();
    expect(screen.getByLabelText('Share via More')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Copy link'));
    expect(screen.getByLabelText('Link copied')).toBeTruthy();
  });

  it('shows a friendly not-found state for an invalid code, with no request', async () => {
    const { fn } = mockFetch([]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('XX9')} />);

    expect(await screen.findByText('Country not found')).toBeTruthy();
    expect(fn).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByText('Back to countries'));
    expect(navigation.popTo).toHaveBeenCalledWith(ROUTES.Home);
  });

  it('shows not-found when the API has no such country', async () => {
    mockFetch([{ body: { data: { objects: [], meta: { more: false } } } }]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('ZZZ')} />);
    expect(await screen.findByText('Country not found')).toBeTruthy();
  });

  it('shows an error with Retry on a network failure', async () => {
    mockFetch([new TypeError('Network request failed')]);
    await renderWithStore(<CountryDetailsScreen {...detailsProps('LKA')} />);
    expect(await screen.findByText('Retry')).toBeTruthy();
  });
});

describe('FavouritesScreen', () => {
  const tabProps = {
    navigation,
    route: { key: 'f', name: ROUTES.FavouritesTab },
  } as unknown as React.ComponentProps<typeof FavouritesScreen>;

  it('shows an empty state and makes no request when there are no favourites', async () => {
    const { fn } = mockFetch([]);
    await renderWithStore(<FavouritesScreen {...tabProps} />);
    expect(await screen.findByText('Your wishlist is empty')).toBeTruthy();
    expect(fn).not.toHaveBeenCalled();
  });

  it('lists only the saved countries', async () => {
    mockFetch([{ body: listBody }]);
    const store = makeTestStore();
    store.dispatch(favouriteAdded('FRA'));
    await renderWithStore(<FavouritesScreen {...tabProps} />, store);

    expect(await screen.findByText('France')).toBeTruthy();
    expect(screen.queryByText('Sri Lanka')).toBeNull();
  });
});
