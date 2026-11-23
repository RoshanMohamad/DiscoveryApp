import { createSlice } from '@reduxjs/toolkit';

export type OnboardingState = { completed: boolean };

const initialState: OnboardingState = { completed: false };

/** Remembers (via redux-persist + MMKV) that the intro slides were seen once. */
const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    onboardingCompleted: state => {
      state.completed = true;
    },
  },
});

export const { onboardingCompleted } = onboardingSlice.actions;
export const onboardingReducer = onboardingSlice.reducer;
export const selectOnboardingCompleted = (state: {
  onboarding: OnboardingState;
}): boolean => state.onboarding.completed;
