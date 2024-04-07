import { createSlice } from '@reduxjs/toolkit';

export const favouriteItemsSlice = createSlice({
  name: 'favouriteItems',
  initialState: [],
  reducers: {
    setFavouriteItems: (state, action) => {
      return action.payload;
    },
    addFavouriteItem: (state, action) => {
      state.push(action.payload);
    },
    removeFavouriteItem: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { setFavouriteItems, addFavouriteItem, removeFavouriteItem } = favouriteItemsSlice.actions;
export default favouriteItemsSlice.reducer;
