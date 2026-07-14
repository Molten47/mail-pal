import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mailReducer from "./mailSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    mail:          mailReducer,
    notifications: notificationReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;