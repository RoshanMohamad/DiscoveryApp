import { makeTestStore } from '../../test/makeTestStore';
import { mockFetch } from '../../test/mockFetch';
import { pendingLinkStored } from '../share/pendingLinkSlice';
import { restoreSession, signIn, signOut } from './authThunks';
import { clearTokens, getTokens, saveTokens } from './services/tokenStorage';

jest.mock('../../app/config', () => ({
  AUTH_BASE_URL: 'https://auth.test',
  ACCESS_TOKEN_MINUTES: 60,
  COUNTRIES_BASE_URL: 'https://countries.test/v5',
  COUNTRIES_API_KEY: 'k',
}));

const emily = {
  id: 1,
  username: 'emilys',
  firstName: 'Emily',
  lastName: 'Johnson',
};
const loginBody = {
  ...emily,
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
};

beforeEach(async () => {
  await clearTokens();
});

describe('signIn', () => {
  it('stores tokens in the Keychain and the profile in Redux', async () => {
    mockFetch([{ body: loginBody }]);
    const store = makeTestStore();

    await store.dispatch(
      signIn({ username: 'emilys', password: 'emilyspass' }),
    );

    expect(await getTokens()).toEqual({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    });
    expect(store.getState().auth.user?.firstName).toBe('Emily');
  });

  it('never leaves a token anywhere in Redux state', async () => {
    mockFetch([{ body: loginBody }]);
    const store = makeTestStore();
    await store.dispatch(
      signIn({ username: 'emilys', password: 'emilyspass' }),
    );

    const serialised = JSON.stringify(store.getState());
    expect(serialised).not.toContain('access-1');
    expect(serialised).not.toContain('refresh-1');
  });

  it('rejects with the API message on wrong credentials', async () => {
    mockFetch([{ status: 400, body: { message: 'Invalid credentials' } }]);
    const store = makeTestStore();

    const result = await store.dispatch(
      signIn({ username: 'emilys', password: 'wrong' }),
    );

    expect(signIn.rejected.match(result)).toBe(true);
    expect(result.payload).toBe('Invalid credentials');
    expect(await getTokens()).toBeNull();
    expect(store.getState().auth.user).toBeNull();
  });
});

describe('restoreSession', () => {
  it('finishes with no user when there are no stored tokens', async () => {
    const { fn } = mockFetch([]);
    const store = makeTestStore();
    expect(store.getState().auth.isRestoring).toBe(true);

    await store.dispatch(restoreSession());

    expect(fn).not.toHaveBeenCalled();
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.isRestoring).toBe(false);
  });

  it('signs in from a valid stored token via /auth/me', async () => {
    await saveTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    const { requests } = mockFetch([{ body: emily }]);
    const store = makeTestStore();

    await store.dispatch(restoreSession());

    expect(requests[0].url).toBe('https://auth.test/auth/me');
    expect(requests[0].headers.get('authorization')).toBe('Bearer access-1');
    expect(store.getState().auth.user?.firstName).toBe('Emily');
    expect(store.getState().auth.isRestoring).toBe(false);
    expect(JSON.stringify(store.getState())).not.toContain('access-1');
  });

  it('refreshes an expired access token once and retries', async () => {
    await saveTokens({ accessToken: 'old', refreshToken: 'refresh-1' });
    const { requests } = mockFetch([
      { status: 401, body: { message: 'Token Expired!' } },
      { body: { accessToken: 'new', refreshToken: 'refresh-2' } },
      { body: emily },
    ]);
    const store = makeTestStore();

    await store.dispatch(restoreSession());

    expect(requests.map(r => new URL(r.url).pathname)).toEqual([
      '/auth/me',
      '/auth/refresh',
      '/auth/me',
    ]);
    expect(requests[2].headers.get('authorization')).toBe('Bearer new');
    expect(await getTokens()).toEqual({
      accessToken: 'new',
      refreshToken: 'refresh-2',
    });
    expect(store.getState().auth.user?.firstName).toBe('Emily');
  });

  it('wipes the tokens when the session is rejected for good', async () => {
    await saveTokens({ accessToken: 'old', refreshToken: 'dead' });
    mockFetch([
      { status: 401, body: { message: 'Token Expired!' } },
      { status: 401, body: { message: 'Invalid refresh token' } },
    ]);
    const store = makeTestStore();

    await store.dispatch(restoreSession());

    expect(await getTokens()).toBeNull();
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.isRestoring).toBe(false);
  });

  it('keeps the tokens on a network failure but still finishes', async () => {
    await saveTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    mockFetch([new TypeError('Network request failed')]);
    const store = makeTestStore();

    await store.dispatch(restoreSession());

    expect(await getTokens()).not.toBeNull();
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.isRestoring).toBe(false);
  });
});

describe('signOut', () => {
  it('clears Keychain, auth, pending link and the RTK Query cache', async () => {
    mockFetch([{ body: loginBody }]);
    const store = makeTestStore();
    await store.dispatch(
      signIn({ username: 'emilys', password: 'emilyspass' }),
    );
    store.dispatch(pendingLinkStored('LKA'));

    await store.dispatch(signOut());

    const state = store.getState();
    expect(await getTokens()).toBeNull();
    expect(state.auth.user).toBeNull();
    expect(state.pendingLink.code).toBeNull();
    expect(Object.keys(state.api.queries)).toHaveLength(0);
    expect(Object.keys(state.api.mutations)).toHaveLength(0);
  });
});
