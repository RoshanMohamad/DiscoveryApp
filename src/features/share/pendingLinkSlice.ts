import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PendingLinkState = {
  /** Country code from a deep link that arrived while logged out. */
  code: string | null;
};

const initialState: PendingLinkState = { code: null };

const pendingLinkSlice = createSlice({
  name: 'pendingLink',
  initialState,
  reducers: {
    pendingLinkStored: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    pendingLinkCleared: state => {
      state.code = null;
    },
  },
});

export const { pendingLinkStored, pendingLinkCleared } =
  pendingLinkSlice.actions;
export const pendingLinkReducer = pendingLinkSlice.reducer;
export const selectPendingLinkCode = (state: {
  pendingLink: PendingLinkState;
}): string | null => state.pendingLink.code;
