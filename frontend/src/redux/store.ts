// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productSlice'
import cartReducers from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products:productsReducer,
    cart:cartReducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
