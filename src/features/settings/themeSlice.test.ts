import {
  pendingLinkCleared,
  pendingLinkReducer,
  pendingLinkStored,
} from '../share/pendingLinkSlice';
import { themeModeSet, themeReducer } from './themeSlice';

describe('themeSlice', () => {
  it('follows the system until the user chooses', () => {
    expect(themeReducer(undefined, { type: 'init' }).mode).toBe('system');
  });

  it('stores the chosen mode', () => {
    expect(themeReducer(undefined, themeModeSet('dark')).mode).toBe('dark');
    expect(themeReducer({ mode: 'dark' }, themeModeSet('light')).mode).toBe(
      'light',
    );
  });
});

describe('pendingLinkSlice', () => {
  it('stores then clears a pending country code', () => {
    const stored = pendingLinkReducer(undefined, pendingLinkStored('LKA'));
    expect(stored.code).toBe('LKA');
    expect(pendingLinkReducer(stored, pendingLinkCleared()).code).toBeNull();
  });
});
