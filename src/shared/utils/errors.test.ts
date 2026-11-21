import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('uses the API message from a fetch error body', () => {
    expect(
      getErrorMessage({
        status: 400,
        data: { message: 'Invalid credentials' },
      }),
    ).toBe('Invalid credentials');
  });

  it('explains network failures', () => {
    expect(getErrorMessage({ status: 'FETCH_ERROR', error: 'x' })).toMatch(
      /connection/i,
    );
  });

  it('falls back to an Error message', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('never leaks unknown shapes', () => {
    expect(getErrorMessage(undefined)).toMatch(/try again/i);
    expect(getErrorMessage({ status: 500, data: 42 })).toMatch(/try again/i);
  });
});
