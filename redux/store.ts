import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice'
import loginReducer from './slices/loginModalSlice'
import appReducer from './slices/appSlice'
export const store = configureStore({
  reducer: {
    cartReducer,
    loginReducer,
    appReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;