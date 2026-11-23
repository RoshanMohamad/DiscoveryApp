import { makeTestStore } from '../../test/makeTestStore';
import {
  onboardingCompleted,
  onboardingReducer,
  selectOnboardingCompleted,
} from './onboardingSlice';

describe('onboardingSlice', () => {
  it('starts as not completed', () => {
    expect(onboardingReducer(undefined, { type: 'init' })).toEqual({
      completed: false,
    });
  });

  it('is marked completed, and stays completed if dispatched twice', () => {
    const store = makeTestStore();
    expect(selectOnboardingCompleted(store.getState())).toBe(false);
    store.dispatch(onboardingCompleted());
    store.dispatch(onboardingCompleted());
    expect(selectOnboardingCompleted(store.getState())).toBe(true);
  });
});
