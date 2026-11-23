import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

/**
 * redux-persist storage backed by MMKV (fast, synchronous, on-device).
 * Only non-secret data goes through here; tokens stay in the Keychain.
 */
const mmkv = createMMKV({ id: 'passport' });

export const mmkvStorage: Storage = {
  setItem: (key, value) => {
    mmkv.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => Promise.resolve(mmkv.getString(key)),
  removeItem: key => {
    mmkv.remove(key);
    return Promise.resolve();
  },
};
