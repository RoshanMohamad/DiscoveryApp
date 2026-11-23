import { gateLink } from './linking';

const make = (loggedIn: boolean) => {
  const onPendingCode = jest.fn();
  return {
    onPendingCode,
    gate: { isAuthenticated: () => loggedIn, onPendingCode },
  };
};

describe('gateLink', () => {
  it('passes the url through when logged in', () => {
    const { gate, onPendingCode } = make(true);
    expect(gateLink('passport://country/LKA', gate)).toBe(
      'passport://country/LKA',
    );
    expect(onPendingCode).not.toHaveBeenCalled();
  });

  it('stores the code and blocks the url when logged out', () => {
    const { gate, onPendingCode } = make(false);
    expect(gateLink('passport://country/lka', gate)).toBeNull();
    expect(onPendingCode).toHaveBeenCalledWith('LKA');
  });

  it('ignores junk links when logged out', () => {
    const { gate, onPendingCode } = make(false);
    expect(gateLink('passport://country/NOPE1', gate)).toBeNull();
    expect(onPendingCode).not.toHaveBeenCalled();
  });

  it('returns null for an empty url', () => {
    const { gate } = make(true);
    expect(gateLink(null, gate)).toBeNull();
    expect(gateLink(undefined, gate)).toBeNull();
  });
});
