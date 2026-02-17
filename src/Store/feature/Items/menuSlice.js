// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   data: {
//     categories: [],
//     items: [],
//     variantGroups: [],
//     variants: []
//   },
//   items: [],          
//   pagination: {},
//   loading: false
// };

// const menuSlice = createSlice({
//   name: "menu",
//   initialState,
//   reducers: {
//     setMenu(state, action) {
//       const payload = action.payload;
//       state.data = payload.data;
//       state.items = payload.data.items;
//       state.pagination = payload.pagination;
//     },

//     // appendMenuItems(state, action) {
//     //   state.items.push(...action.payload);
//     // },
//     appendMenuItems(state, action) {
//       // debugger
//       const newItems = action.payload.filter(
//         newItem => !state.items.some(i => i._id === newItem._id)
//       );
//       state.items.push(...newItems);
//     },


//     clearMenu() {
//       return initialState;
//     }
//   }
// });

// export const { setMenu, appendMenuItems, clearMenu } = menuSlice.actions;
// export default menuSlice.reducer;





import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    categories: [],
    variantGroups: [],
    variants: []
  },
  items: [],
  pagination: {},
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {

    // 🔁 FIRST LOAD / RESET
    setMenu(state, action) {
      const payload = action.payload;

      state.data.categories = payload.data.categories || [];
      state.data.variantGroups = payload.data.variantGroups || [];
      state.data.variants = payload.data.variants || [];

      state.items = payload.data.items || [];
      state.pagination = payload.pagination || {};
    },

    // ➕ APPEND ITEMS (DUPLICATE SAFE)
    appendMenuItems(state, action) {
      const newItems = action.payload.filter(
        newItem => !state.items.some(i => i._id === newItem._id)
      );

      state.items.push(...newItems);
    },

    // ➕ APPEND VARIANT GROUPS (DUPLICATE SAFE)
    appendVariantGroups(state, action) {
      const newGroups = action.payload.filter(
        g => !state.data.variantGroups.some(vg => vg._id === g._id)
      );

      state.data.variantGroups.push(...newGroups);
    },

    // ➕ APPEND VARIANTS (DUPLICATE SAFE)
    appendVariants(state, action) {
      const newVariants = action.payload.filter(
        v => !state.data.variants.some(ev => ev._id === v._id)
      );

      state.data.variants.push(...newVariants);
    },

    // ❌ CLEAR ALL
    clearMenu() {
      return initialState;
    }
  }
});

export const {
  setMenu,
  appendMenuItems,
  appendVariantGroups,
  appendVariants,
  clearMenu
} = menuSlice.actions;

export default menuSlice.reducer;
