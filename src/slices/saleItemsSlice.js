import { createSlice } from '@reduxjs/toolkit';

export const saleItemsSlice = createSlice({
  name: 'saleItems',
  initialState: [],
  reducers: {
    setSaleItems: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSaleItems } = saleItemsSlice.actions;
export default saleItemsSlice.reducer;
