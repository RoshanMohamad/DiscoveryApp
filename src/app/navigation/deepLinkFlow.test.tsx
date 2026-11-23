import React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { act, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { restoreFinished, signedIn } from '../../features/auth/authSlice';
import { onboardingCompleted } from '../../features/onboarding/onboardingSlice';
import { pendingLinkStored } from '../../features/share/pendingLinkSlice';
import { makeTestStore, type TestStore } from '../../test/makeTestStore';
import { mockFetch } from '../../test/mockFetch';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { createLinking } from './linking';
import { RootNavigator } from './RootNavigator';

jest.mock('../../app/config', () => ({
  AUTH_BASE_URL: 'https://auth.test',
  ACCESS_TOKEN_MINUTES: 60,
  COUNTRIES_BASE_URL: 'https://countries.test/v5',
  COUNTRIES_API_KEY: 'test-key',
}));

const emily = { id: 1, username: 'emilys', firstName: 'Emily', lastName: 'J' };

const countryObject = (name: string, code: string) => ({
  names: { common: name, official: `Republic of ${name}` },
  codes: { alpha_3: code },
  region: 'Asia',
});

/** Answers by URL so Home (list) and Details (single) can fetch in any order. */
const routeFetch = () =>
  mockFetch(request => {
    const { pathname } = new URL(request.url);
    if (pathname.endsWith('/codes.alpha_3/LKA')) {
      return {
        body: { data: { objects: [countryObject('Sri Lanka', 'LKA')] } },
      };
    }
    return {
      body: {
        data: {
          objects: [countryObject('Sri Lanka', 'LKA')],
          meta: { more: false },
        },
      },
    };
  });

type UrlListener = (event: { url: string }) => void;

/** Fakes the OS: an optional launch URL, and a handle to "open a link" later. */
const fakeLinking = (initialUrl: string | null) => {
  let listener: UrlListener | null = null;
  jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(initialUrl);
  jest.spyOn(Linking, 'addEventListener').mockImplementation(((
    _type: string,
    handler: UrlListener,
  ) => {
    listener = handler;
    return { remove: jest.fn() };
  }) as unknown as typeof Linking.addEventListener);
  return {
    open: (url: string) => act(() => listener?.({ url })),
  };
};

const mountApp = async (store: TestStore) => {
  const linking = createLinking({
    isAuthenticated: () => selectIsAuthenticated(store.getState()),
    onPendingCode: code => store.dispatch(pendingLinkStored(code)),
  });
  await render(
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </Provider>,
  );
};

const loggedInStore = () => {
  const store = makeTestStore();
  store.dispatch(signedIn(emily));
  store.dispatch(restoreFinished());
  return store;
};

afterEach(() => jest.restoreAllMocks());

describe('deep link: passport://country/<CODE>', () => {
  it('cold start while logged in opens that country on Details', async () => {
    routeFetch();
    fakeLinking('passport://country/lka');
    await mountApp(loggedInStore());

    expect(await screen.findByText('Republic of Sri Lanka')).toBeTruthy();
  });

  it('warm start while logged in opens that country', async () => {
    routeFetch();
    const os = fakeLinking(null);
    await mountApp(loggedInStore());
    expect(await screen.findByText(/Hello, Emily/)).toBeTruthy();

    await os.open('passport://country/LKA');

    expect(await screen.findByText('Republic of Sri Lanka')).toBeTruthy();
  });

  it('link opened while logged out is stored, then opened after login', async () => {
    routeFetch();
    fakeLinking('passport://country/LKA');
    const store = makeTestStore();
    store.dispatch(restoreFinished());
    store.dispatch(onboardingCompleted());
    await mountApp(store);

    // Logged out: the login screen shows and the code is remembered.
    expect(await screen.findByText(/Welcome Back/)).toBeTruthy();
    expect(store.getState().pendingLink.code).toBe('LKA');

    // Log in: app opens straight onto that country, and the link is consumed.
    await act(async () => {
      store.dispatch(signedIn(emily));
    });
    expect(await screen.findByText('Republic of Sri Lanka')).toBeTruthy();
    expect(store.getState().pendingLink.code).toBeNull();
  });

  it('an unknown code shows a friendly state, not a crash', async () => {
    const { requests } = routeFetch();
    fakeLinking('passport://country/ABCD');
    await mountApp(loggedInStore());

    expect(await screen.findByText('Country not found')).toBeTruthy();
    expect(
      requests.some(r => new URL(r.url).pathname.includes('codes.alpha_3')),
    ).toBe(false);
  });
});
