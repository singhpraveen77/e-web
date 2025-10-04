import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit'

export interface CartItem {
  _id: string;        // product id
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  products: CartItem[];
  error: string | null;
}

// Load cart from localStorage
const storedCart = localStorage.getItem("cart_item");
const initialState: CartState = {
  products: storedCart ? JSON.parse(storedCart) : [],
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ➕ Add Item
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existing = state.products.find((p) => p._id === item._id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.products.push({ ...item, quantity: item.quantity || 1 });
      }

      localStorage.setItem("cart_item", JSON.stringify(state.products));
    },

    // ❌ Remove Item
    removeItem: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
      localStorage.setItem("cart_item", JSON.stringify(state.products));
    },

    // 🔄 Update Quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.products.find((p) => p._id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      localStorage.setItem("cart_item", JSON.stringify(state.products));
    },

    // 🗑 Clear Cart
    clearCart: (state) => {
      state.products = [];
      localStorage.removeItem("cart_item");
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;


