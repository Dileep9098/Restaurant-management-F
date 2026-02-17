import { showSuccessMsg } from "../../../utils/ShowMessages";
import { createSlice } from "@reduxjs/toolkit";

/* 🔥 localStorage se cart load */
const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Invalid cart in storage");
    return null;
  }
};

const storedCart = loadCartFromStorage();

const initialState = storedCart || {
  restaurant: null,
  table: null,
  items: []
};

/* 🔥 VARIANT COMPARISON */
// const areVariantsSame = (a = [], b = []) => {
//   if (a.length !== b.length) return false;

//   return a.every(v1 =>
//     b.some(v2 => v1._id === v2._id && v1.quantity === v2.quantity)
//   );
// };
const normalizeVariants = (variants = []) =>
  variants
    .map(v => ({
      id: v._id?.toString(),
      qty: v.quantity ?? 1
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

// const areVariantsSame = (a = [], b = []) => {
//   const va = normalizeVariants(a);
//   const vb = normalizeVariants(b);

//   if (va.length !== vb.length) return false;

//   return va.every(
//     (v, i) => v.id === vb[i].id && v.qty === vb[i].qty
//   );
// };

const areVariantsSame = (a = [], b = []) => {
  const va = normalizeVariants(a);
  const vb = normalizeVariants(b);

  if (va.length !== vb.length) return false;

  return va.every(
    (v, i) => v.id === vb[i].id   
  );
};


const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /* ================= ADD TO CART ================= */
    addToCart: (state, action) => {
      const { item, variants = [], restaurant, table, showMsg } = action.payload;

      const exists = state.items.some(ci =>
        ci.item._id.toString() === item._id.toString() &&
        areVariantsSame(ci.variants, variants)
      );

      // 🔥 DUPLICATE BLOCK
      if (exists) {
        showMsg?.("⚠️ Item already exists in cart");
        return;
      }

      const basePrice =
        item.price ?? item.basePrice ?? item.sellingPrice ?? 0;

      const quantity =
        variants.length
          ? variants.reduce((s, v) => s + (v.quantity ?? 1), 0)
          : 1;

      const totalPrice =
        variants.length
          ? variants.reduce(
            (sum, v) =>
              sum + (basePrice + (v.price || 0)) * (v.quantity ?? 1),
            0
          )
          : basePrice * quantity;

      state.restaurant = restaurant;
      state.table = table;

      state.items.push({
        item,
        variants,
        quantity,
        totalPrice
      });

      localStorage.setItem("cart", JSON.stringify(state));

      showSuccessMsg?.("✅ Item added to cart");
    }

    ,

    /* ================= ITEM QTY ================= */
    increaseQty: (state, action) => {
      const itemId = action.payload;

      const ci = state.items.find(i => i.item._id === itemId);
      if (!ci || ci.variants.length) return;

      ci.quantity += 1;
      ci.totalPrice = ci.quantity * (ci.item.price ?? ci.item.basePrice ?? 0);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    decreaseQty: (state, action) => {
      const itemId = action.payload;

      const ci = state.items.find(i => i.item._id === itemId);
      if (!ci || ci.variants.length) return;

      ci.quantity -= 1;

      if (ci.quantity <= 0) {
        state.items = state.items.filter(i => i.item._id !== itemId);
      } else {
        ci.totalPrice =
          ci.quantity * (ci.item.price ?? ci.item.basePrice ?? 0);
      }

      localStorage.setItem("cart", JSON.stringify(state));
    },

    /* ================= VARIANT QTY ================= */
    // increaseVariantQty: (state, action) => {

    //   const { itemId, variantId } = action.payload;

    //   const ci = state.items.find(i => i.item._id === itemId);
    //   if (!ci) return;

    //   const v = ci.variants.find(v => v._id === variantId);
    //   if (!v) return;

    //   v.quantity += 1;

    //   const basePrice =
    //     ci.item.price ?? ci.item.basePrice ?? 0;

    //   ci.totalPrice = ci.variants.reduce(
    //     (sum, v) =>
    //       sum + (basePrice + (v.price || 0)) * v.quantity,
    //     0
    //   );

    //   localStorage.setItem("cart", JSON.stringify(state));
    // },

    // decreaseVariantQty: (state, action) => {
    //   const { itemId, variantId } = action.payload;

    //   const ci = state.items.find(i => i.item._id === itemId);
    //   if (!ci) return;

    //   ci.variants = ci.variants
    //     .map(v =>
    //       v._id === variantId
    //         ? { ...v, quantity: v.quantity - 1 }
    //         : v
    //     )
    //     .filter(v => v.quantity > 0);

    //   if (ci.variants.length === 0) {
    //     state.items = state.items.filter(i => i.item._id !== itemId);
    //   } else {
    //     const basePrice =
    //       ci.item.price ?? ci.item.basePrice ?? 0;

    //     ci.totalPrice = ci.variants.reduce(
    //       (sum, v) =>
    //         sum + (basePrice + (v.price || 0)) * v.quantity,
    //       0
    //     );
    //   }

    //   localStorage.setItem("cart", JSON.stringify(state));
    // },


    decreaseVariantQty: (state, action) => {
      const { itemId, variantId } = action.payload;

      const ci = state.items.find(i =>
        i.item._id.toString() === itemId.toString() &&
        i.variants.some(v => v._id.toString() === variantId.toString())
      );

      if (!ci) return;

      ci.variants = ci.variants
        .map(v =>
          v._id.toString() === variantId.toString()
            ? { ...v, quantity: v.quantity - 1 }
            : v
        )
        .filter(v => v.quantity > 0);

      if (ci.variants.length === 0) {
        state.items = state.items.filter(i => i !== ci);
      } else {
        const basePrice =
          ci.item.price ?? ci.item.basePrice ?? ci.item.sellingPrice ?? 0;

        ci.totalPrice = ci.variants.reduce(
          (sum, vr) =>
            sum + (basePrice + (vr.price || 0)) * vr.quantity,
          0
        );
      }

      localStorage.setItem("cart", JSON.stringify(state));
    },

    increaseVariantQty: (state, action) => {
      const { itemId, variantId } = action.payload;

      // 🔥 EXACT CART ITEM FIND
      const ci = state.items.find(i =>
        i.item._id.toString() === itemId.toString() &&
        i.variants.some(v => v._id.toString() === variantId.toString())
      );

      if (!ci) return;

      const v = ci.variants.find(
        v => v._id.toString() === variantId.toString()
      );
      if (!v) return;

      v.quantity += 1;

      const basePrice =
        ci.item.price ?? ci.item.basePrice ?? ci.item.sellingPrice ?? 0;

      ci.totalPrice = ci.variants.reduce(
        (sum, vr) =>
          sum + (basePrice + (vr.price || 0)) * vr.quantity,
        0
      );

      localStorage.setItem("cart", JSON.stringify(state));
    },

    /* ================= REMOVE ITEM ================= */
    removeItem: (state, action) => {
      state.items = state.items.filter(
        i => i.item._id !== action.payload
      );

      localStorage.setItem("cart", JSON.stringify(state));
    },

    /* ================= CLEAR CART ================= */
    clearCart: (state) => {
      state.restaurant = null;
      state.table = null;
      state.items = [];
      localStorage.removeItem("cart");
    }
  }
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  increaseVariantQty,
  decreaseVariantQty,
  removeItem,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
