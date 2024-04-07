import { createSlice } from '@reduxjs/toolkit';

export const userItemsSlice = createSlice({
  name: 'userItems',
  initialState: [],
  reducers: {
    setUserItems: (state, action) => {
      return action.payload;
    },
    editUserItem: (state, action) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    // You can add more reducers for adding/removing items if needed
  },
});

export const { setUserItems, editUserItem } = userItemsSlice.actions;
export default userItemsSlice.reducer;
