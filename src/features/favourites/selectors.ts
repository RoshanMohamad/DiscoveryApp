import type { FavouritesState } from './favouritesSlice';

type WithFavourites = { favourites: FavouritesState };

export const selectFavouriteCodes = (state: WithFavourites): string[] =>
  state.favourites.codes;

export const selectIsFavourite = (
  state: WithFavourites,
  code: string,
): boolean => state.favourites.codes.includes(code);
