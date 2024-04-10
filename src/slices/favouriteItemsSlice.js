import { createSlice } from '@reduxjs/toolkit';

export const favouriteItemsSlice = createSlice({
    name: 'favouriteItems',
    initialState: [],
    reducers: {
        setFavouriteItems: (state, action) => action.payload,
        addFavouriteItem: (state, action) => {
            // Prevent adding duplicate IDs
            if (!state.includes(action.payload.id)) {
                state.push(action.payload.id);
            }
        },
        removeFavouriteItem: (state, action) => state.filter(itemID => itemID !== action.payload.id),
    },
});

export const { setFavouriteItems, addFavouriteItem, removeFavouriteItem } = favouriteItemsSlice.actions;
export default favouriteItemsSlice.reducer;
