import { createSlice } from "@reduxjs/toolkit";

// store/feature/context/contextSlice.js
const initialState = {
  restaurant: null,
  table: null
};

const contextSlice = createSlice({
  name: "context",
  initialState,
  reducers: {
    setContext: (state, action) => {
      state.restaurant = action.payload.restaurant;
      state.table = action.payload.table;
    }
  }
});

export const { setContext } = contextSlice.actions;
export default contextSlice.reducer;
