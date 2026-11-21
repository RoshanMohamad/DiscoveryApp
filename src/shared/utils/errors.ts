const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_MESSAGE = 'Cannot reach the server. Check your connection.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Turns anything thrown by RTK Query / fetch / our own code into a message
 * that is safe to show a user. Never returns raw objects.
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (!isRecord(error)) {
    return FALLBACK_MESSAGE;
  }
  // FetchBaseQueryError: { status, data } where data may carry { message }.
  if (error.status === 'FETCH_ERROR') {
    return NETWORK_MESSAGE;
  }
  if (isRecord(error.data) && typeof error.data.message === 'string') {
    return error.data.message;
  }
  if (typeof error.message === 'string') {
    return error.message;
  }
  return FALLBACK_MESSAGE;
};
