



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";

// ================= LOGIN =================

export const getAllItems = createAsyncThunk(
  "items/getAllItems",
  async ( ) => {
    try {
      const res = await axiosInstance.get(
        Config.END_POINT_LIST.GET_ALL_MENU_ITEMS,
      
        { withCredentials: true }
      );
      return res.data.data; 
    } catch (err) {
      return (err.response?.data || { message: err.message });
    }
  }
);




// ================= INITIAL STATE =================
const initialState = {
    items: [],
    loading: false,
    error: null

};

// ================= SLICE =================

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    clearAuth(state) {
        state.items = [];
        state.loading = false;
        state.error = null;
    

    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(getAllItems.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.items = [];
      })

      .addCase(getAllItems.fulfilled, (s, action) => {
        s.loading = false;
        s.items = action.payload || [];

      })

      .addCase(getAllItems.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload?.message || "Fetching items failed";
      })

      

  },
});

export const { clearAuth } = itemSlice.actions;
export default itemSlice.reducer;
