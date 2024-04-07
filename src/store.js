import { configureStore } from '@reduxjs/toolkit';
import saleItemsReducer from './features/saleItemsSlice';
import favouriteItemsReducer from './features/favouriteItemsSlice';
import userItemsReducer from './features/userItemsSlice';

export const store = configureStore({
  reducer: {
    saleItems: saleItemsReducer,
    favouriteItems: favouriteItemsReducer,
    userItems: userItemsReducer,
  },
});
