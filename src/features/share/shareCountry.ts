import { Share } from 'react-native';
import { buildCountryLink } from './deepLink';

export type ShareInput = {
  code: string;
  name: string;
  flagEmoji: string;
};

export type ShareOutcome = 'shared' | 'dismissed' | 'failed';

export const buildShareMessage = ({
  code,
  name,
  flagEmoji,
}: ShareInput): string =>
  `Check out ${name}${
    flagEmoji ? ` ${flagEmoji}` : ''
  } on Passport: ${buildCountryLink(code)}`;

/**
 * Opens the system share sheet. Closing the sheet without sharing is a normal
 * outcome ("dismissed"), not an error. Only a real failure returns "failed".
 */
export const shareCountry = async (
  input: ShareInput,
): Promise<ShareOutcome> => {
  try {
    const result = await Share.share({ message: buildShareMessage(input) });
    return result.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch {
    return 'failed';
  }
};
