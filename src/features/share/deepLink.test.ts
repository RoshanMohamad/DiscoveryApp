import { buildCountryLink, parseCountryLink } from './deepLink';

describe('buildCountryLink', () => {
  it('builds passport://country/<CODE>', () => {
    expect(buildCountryLink('LKA')).toBe('passport://country/LKA');
  });

  it('upper-cases the code', () => {
    expect(buildCountryLink('lka')).toBe('passport://country/LKA');
  });

  it('throws on something that is not an alpha-3 code', () => {
    expect(() => buildCountryLink('SriLanka')).toThrow(RangeError);
    expect(() => buildCountryLink('')).toThrow(RangeError);
  });
});

describe('parseCountryLink', () => {
  it('returns the code from a valid link', () => {
    expect(parseCountryLink('passport://country/LKA')).toBe('LKA');
  });

  it('normalises a lower-case code', () => {
    expect(parseCountryLink('passport://country/lka')).toBe('LKA');
  });

  it('accepts a trailing slash, query string and hash', () => {
    expect(parseCountryLink('passport://country/LKA/')).toBe('LKA');
    expect(parseCountryLink('passport://country/LKA?ref=share')).toBe('LKA');
    expect(parseCountryLink('passport://country/LKA#top')).toBe('LKA');
  });

  it('round-trips with buildCountryLink', () => {
    expect(parseCountryLink(buildCountryLink('jpn'))).toBe('JPN');
  });

  it.each([
    ['wrong scheme', 'https://country/LKA'],
    ['wrong host', 'passport://city/LKA'],
    ['missing code', 'passport://country/'],
    ['two-letter code', 'passport://country/LK'],
    ['long code', 'passport://country/LKAA'],
    ['digits', 'passport://country/L1A'],
    ['extra path', 'passport://country/LKA/details'],
    ['empty string', ''],
    ['plain text', 'hello'],
  ])('returns null for %s', (_name, url) => {
    expect(parseCountryLink(url)).toBeNull();
  });

  it('returns null for null / undefined', () => {
    expect(parseCountryLink(null)).toBeNull();
    expect(parseCountryLink(undefined)).toBeNull();
  });
});
