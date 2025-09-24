"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  count: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.count = action.payload.reduce((acc, i) => acc + i.quantity, 0);
    },
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      state.count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      state.count = state.items.reduce((acc, i) => acc + i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
