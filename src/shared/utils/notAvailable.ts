import { Alert } from 'react-native';

/**
 * Placeholder action for features the design shows but this demo does not
 * implement (Google sign-in, password reset, ...). Tells the user honestly
 * instead of silently doing nothing.
 */
export const showNotAvailable = (feature: string): void => {
  Alert.alert('Not available', `${feature} is not part of this demo app.`);
};
