import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** `system` = follow the phone until the user picks a side with the toggle. */
export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeState = { mode: ThemeMode };

const initialState: ThemeState = { mode: 'system' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeModeSet: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { themeModeSet } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
export const selectThemeMode = (state: { theme: ThemeState }): ThemeMode =>
  state.theme.mode;
