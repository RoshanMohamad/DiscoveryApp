import { normalizeCountryCode } from './countryCode';
import { formatNumber } from './format';

describe('normalizeCountryCode', () => {
  it('upper-cases and trims valid codes', () => {
    expect(normalizeCountryCode('lka')).toBe('LKA');
    expect(normalizeCountryCode(' LKA ')).toBe('LKA');
  });

  it.each(['', 'LK', 'LKAA', 'L1A', 'L A', null, undefined, 42])(
    'rejects %p',
    value => {
      expect(normalizeCountryCode(value)).toBeNull();
    },
  );
});

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(21919000)).toBe('21,919,000');
  });
});
