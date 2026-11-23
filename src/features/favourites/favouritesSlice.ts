import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FavouritesState = {
  /** ISO alpha-3 codes, in the order they were added. A list, never duplicated. */
  codes: string[];
};

const initialState: FavouritesState = { codes: [] };

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    favouriteAdded: (state, action: PayloadAction<string>) => {
      if (!state.codes.includes(action.payload)) {
        state.codes.push(action.payload);
      }
    },
    favouriteRemoved: (state, action: PayloadAction<string>) => {
      state.codes = state.codes.filter(code => code !== action.payload);
    },
    favouriteToggled: (state, action: PayloadAction<string>) => {
      const index = state.codes.indexOf(action.payload);
      if (index === -1) {
        state.codes.push(action.payload);
      } else {
        state.codes.splice(index, 1);
      }
    },
  },
});

export const { favouriteAdded, favouriteRemoved, favouriteToggled } =
  favouritesSlice.actions;
export const favouritesReducer = favouritesSlice.reducer;
