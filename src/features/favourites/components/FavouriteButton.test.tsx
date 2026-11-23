import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { makeTestStore } from '../../../test/makeTestStore';
import { renderWithStore } from '../../../test/renderWithStore';
import { favouriteAdded } from '../favouritesSlice';
import { FavouriteButton } from './FavouriteButton';

describe('FavouriteButton', () => {
  it('toggles the country in the store and updates its label', async () => {
    const { store } = await renderWithStore(
      <FavouriteButton code="LKA" name="Sri Lanka" />,
    );

    await fireEvent.press(screen.getByLabelText('Add Sri Lanka to favourites'));
    expect(store.getState().favourites.codes).toEqual(['LKA']);

    await fireEvent.press(
      await screen.findByLabelText('Remove Sri Lanka from favourites'),
    );
    expect(store.getState().favourites.codes).toEqual([]);
    expect(
      await screen.findByLabelText('Add Sri Lanka to favourites'),
    ).toBeTruthy();
  });

  it('starts selected when the country is already a favourite', async () => {
    const store = makeTestStore();
    store.dispatch(favouriteAdded('LKA'));
    await renderWithStore(
      <FavouriteButton code="LKA" name="Sri Lanka" />,
      store,
    );
    expect(
      screen.getByLabelText('Remove Sri Lanka from favourites'),
    ).toBeTruthy();
  });
});
