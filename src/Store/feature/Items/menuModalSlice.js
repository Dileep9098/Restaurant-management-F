import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  item: null
};

const menuModalSlice = createSlice({
  name: "menuModal",
  initialState,
  reducers: {
    openVariantModal: (state, action) => {
      state.isOpen = true;
      state.item = action.payload; 
    },
    closeVariantModal: (state) => {
      state.isOpen = false;
      state.item = null;
    }
  }
});

export const {
  openVariantModal,
  closeVariantModal
} = menuModalSlice.actions;

export default menuModalSlice.reducer;
