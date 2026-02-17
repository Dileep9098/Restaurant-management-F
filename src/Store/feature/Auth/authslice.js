// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../../apiHandler/axiosInstance';
// import Config from '../../../Config/Config';

// // Async login thunk
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post(Config.END_POINT_LIST['LOGIN_USER'], { email, password }, { withCredentials: true });
//       return res.data; // { token, user }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );
// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async ({ rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(Config.END_POINT_LIST["LOGOUT_USER"], { withCredentials: true });
//       return res.data; 
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// // Async fetch current user (optional) - for token refresh/rehydration
// export const fetchMe = createAsyncThunk(
//   'auth/fetchMe',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(Config.END_POINT_LIST["LOAD_USER"], { withCredentials: true }); // implement /auth/me in backend if needed
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// // Initial state: try to hydrate from localStorage
// const tokenFromStorage = localStorage.getItem('token');
// const userFromStorage = localStorage.getItem('user');

// const initialState = {
//   user: userFromStorage ? JSON.parse(userFromStorage) : null,
//   token: tokenFromStorage || null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.loading = false;
//       state.error = null;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//     setCredentials(state, action) {
//       // action.payload = { token, user }
//       state.token = action.payload.token;
//       state.user = action.payload.user;
//       localStorage.setItem('token', action.payload.token);
//       localStorage.setItem('user', JSON.stringify(action.payload.user));
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
//       .addCase(loginUser.fulfilled, (s, action) => {
//         s.loading = false;
//         s.token = action.payload.token;
//         s.user = action.payload.user;
//         localStorage.setItem('token', action.payload.token);
//         localStorage.setItem('user', JSON.stringify(action.payload.user));
//       })
//       .addCase(loginUser.rejected, (s, action) => {
//         s.loading = false;
//         s.error = action.payload?.message || 'Login failed';
//       })
//       .addCase(fetchMe.fulfilled, (s, action) => {
//         s.user = action.payload.user || action.payload;
//         localStorage.setItem('user', JSON.stringify(s.user));
//       });
//   }
// });

// export const { logout, setCredentials } = authSlice.actions;
// export default authSlice.reducer;



const EXPIRY_MINUTES = 1440;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";

// ================= LOGIN =================

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        Config.END_POINT_LIST.LOGIN_USER,
        { email, password },
        { withCredentials: true }
      );
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ================= LOGOUT =================

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        Config.END_POINT_LIST.LOGOUT_USER,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ================= LOAD USER =================
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      // debugger
      const res = await axiosInstance.get(
        Config.END_POINT_LIST.LOAD_USER,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);



const setItemWithExpiry = (key, value, expiryInMinutes) => {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + expiryInMinutes * 60 * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key); // 🔥 auto delete
      return null;
    }

    return item.value;
  } catch {
    return null;
  }
};



// ================= INITIAL STATE =================
const initialState = {
  user: getItemWithExpiry("user"),
  permissions: [],
  token: getItemWithExpiry("token"),
  loading: false,
  error: null,
  isAuthenticated: !!getItemWithExpiry("token"),
};

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.permissions = [];
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })

      .addCase(loginUser.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload.token;
        s.user = action.payload.user;
        s.isAuthenticated = true;

        setItemWithExpiry("token", action.payload.token, EXPIRY_MINUTES);
        setItemWithExpiry("user", action.payload.user, EXPIRY_MINUTES);
      })

      .addCase(loginUser.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload?.message || "Login failed";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })

      .addCase(fetchMe.fulfilled, (s, action) => {
        console.log("REDUX SET PERMISSIONS 👉", action.payload.permissions);

        s.user = action.payload.user || action.payload;
          const perms = action.payload?.permissions;

        if (Array.isArray(perms) && perms.length > 0) {
          s.permissions = perms;
        } s.isAuthenticated = true; // ✅ add this

        setItemWithExpiry("user", s.user, EXPIRY_MINUTES);
      });

  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
