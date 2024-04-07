import { configureStore } from '@reduxjs/toolkit';
import saleItemsReducer from './slices/saleItemsSlice';
import favouriteItemsReducer from './slices/favouriteItemsSlice';
import userItemsReducer from './slices/userItemsSlice';

export const store = configureStore({
  reducer: {
    saleItems: saleItemsReducer,
    favouriteItems: favouriteItemsReducer,
    userItems: userItemsReducer,
  },
});
