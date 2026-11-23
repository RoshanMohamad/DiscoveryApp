import { Share } from 'react-native';
import { buildShareMessage, shareCountry } from './shareCountry';

const lka = { code: 'LKA', name: 'Sri Lanka', flagEmoji: '🇱🇰' };

describe('buildShareMessage', () => {
  it('includes name, flag and the deep link', () => {
    expect(buildShareMessage(lka)).toBe(
      'Check out Sri Lanka 🇱🇰 on Passport: passport://country/LKA',
    );
  });

  it('has no double space when there is no flag emoji', () => {
    expect(buildShareMessage({ ...lka, flagEmoji: '' })).toBe(
      'Check out Sri Lanka on Passport: passport://country/LKA',
    );
  });
});

describe('shareCountry', () => {
  afterEach(() => jest.restoreAllMocks());

  it('reports "shared" when the user completes the share', async () => {
    const spy = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({
        action: Share.sharedAction,
        activityType: undefined,
      });
    await expect(shareCountry(lka)).resolves.toBe('shared');
    expect(spy).toHaveBeenCalledWith({
      message: expect.stringContaining('passport://country/LKA'),
    });
  });

  it('treats closing the sheet as "dismissed", not an error', async () => {
    jest
      .spyOn(Share, 'share')
      .mockResolvedValue({
        action: Share.dismissedAction,
        activityType: undefined,
      });
    await expect(shareCountry(lka)).resolves.toBe('dismissed');
  });

  it('returns "failed" instead of throwing when sharing breaks', async () => {
    jest.spyOn(Share, 'share').mockRejectedValue(new Error('boom'));
    await expect(shareCountry(lka)).resolves.toBe('failed');
  });
});
