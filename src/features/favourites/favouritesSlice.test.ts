import {
  favouriteAdded,
  favouriteRemoved,
  favouritesReducer,
  favouriteToggled,
  type FavouritesState,
} from './favouritesSlice';
import { selectFavouriteCodes, selectIsFavourite } from './selectors';

const empty: FavouritesState = { codes: [] };

describe('favouritesSlice', () => {
  it('adds a country', () => {
    expect(favouritesReducer(empty, favouriteAdded('LKA')).codes).toEqual([
      'LKA',
    ]);
  });

  it('never stores the same country twice', () => {
    let state = favouritesReducer(empty, favouriteAdded('LKA'));
    state = favouritesReducer(state, favouriteAdded('LKA'));
    expect(state.codes).toEqual(['LKA']);
  });

  it('removes a country and ignores codes that are not saved', () => {
    const state: FavouritesState = { codes: ['LKA', 'JPN'] };
    expect(favouritesReducer(state, favouriteRemoved('LKA')).codes).toEqual([
      'JPN',
    ]);
    expect(favouritesReducer(state, favouriteRemoved('FRA')).codes).toEqual([
      'LKA',
      'JPN',
    ]);
  });

  it('toggles on, then off', () => {
    const on = favouritesReducer(empty, favouriteToggled('LKA'));
    expect(on.codes).toEqual(['LKA']);
    const off = favouritesReducer(on, favouriteToggled('LKA'));
    expect(off.codes).toEqual([]);
  });

  it('keeps insertion order and does not mutate the previous state', () => {
    const before: FavouritesState = { codes: ['LKA'] };
    const after = favouritesReducer(before, favouriteAdded('JPN'));
    expect(after.codes).toEqual(['LKA', 'JPN']);
    expect(before.codes).toEqual(['LKA']);
  });

  it('selectors read the saved codes', () => {
    const state = { favourites: { codes: ['LKA'] } };
    expect(selectFavouriteCodes(state)).toEqual(['LKA']);
    expect(selectIsFavourite(state, 'LKA')).toBe(true);
    expect(selectIsFavourite(state, 'JPN')).toBe(false);
  });
});
