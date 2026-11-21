import { clearTokens, getTokens, saveTokens } from './tokenStorage';

describe('tokenStorage', () => {
  beforeEach(async () => {
    await clearTokens();
  });

  it('returns null when nothing is stored', async () => {
    expect(await getTokens()).toBeNull();
  });

  it('round-trips access and refresh tokens', async () => {
    await saveTokens({ accessToken: 'a-token', refreshToken: 'r-token' });
    expect(await getTokens()).toEqual({
      accessToken: 'a-token',
      refreshToken: 'r-token',
    });
  });

  it('clears stored tokens', async () => {
    await saveTokens({ accessToken: 'a', refreshToken: 'r' });
    await clearTokens();
    expect(await getTokens()).toBeNull();
  });
});
