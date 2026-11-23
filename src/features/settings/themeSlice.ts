import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** `system` follows the phone. The app starts in `dark` to match the design mock-ups until the user picks a side. */
export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeState = { mode: ThemeMode };

const initialState: ThemeState = { mode: 'dark' };

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
