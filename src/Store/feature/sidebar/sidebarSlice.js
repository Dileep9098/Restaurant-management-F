// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../../apiHandler/axiosInstance';

// export const fetchSidebar = createAsyncThunk(
//   "sidebar/fetch",
//   async () => {
//     const res = await axiosInstance.get("/api/v1/sidebar", {
//       withCredentials: true
//     });
//     return res.data.data;
//   }
// );

// const sidebarSlice = createSlice({
//   name: "sidebar",
//   initialState: { list: [], loading: false },
//   extraReducers: (builder) => {
//     builder.addCase(fetchSidebar.fulfilled, (state, action) => {
//       state.list = action.payload;
//     });
//   }
// });

// export default sidebarSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../apiHandler/axiosInstance';

export const fetchSidebar = createAsyncThunk(
  "sidebar/fetch",
  async () => {
    const res = await axiosInstance.get("/api/v1/sidebar", {
      withCredentials: true
    });
    return res.data.data;
  }
);

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebar.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSidebar.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.list = action.payload;
        }
      })
      .addCase(fetchSidebar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});


export default sidebarSlice.reducer;



