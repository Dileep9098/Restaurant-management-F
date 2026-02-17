import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/Auth/authslice";
import sidebarReducer from './feature/sidebar/sidebarSlice';
import itemReducer from './feature/Items/itemSlice';
import menuModalReducer from "./feature/Items/menuModalSlice"
import cartReducer from "./feature/Items/cartSlice";
import menuReducer from "./feature/Items/menuSlice"
import contextReducer from "./feature/context/contextSlice"

// import roleReducer from '../features/roles/roleSlice'; // optional if you use it
// import permissionReducer from '../features/permissions/permissionSlice'; // optional

export const store = configureStore({
  reducer: {
    auth       :  authReducer,
    sidebar    :  sidebarReducer,
    items      :  itemReducer,
    menuModal  :  menuModalReducer,
    cart       :  cartReducer,
    menu       :  menuReducer,
    context     : contextReducer

    // roles: roleReducer,
    // permissions: permissionReducer,
  },
});
