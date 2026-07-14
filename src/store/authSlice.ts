import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userId:      string | null;
  accessToken: string | null;
  isLoggedIn:  boolean;
}

const initialState: AuthState = {
  userId:      null,
  accessToken: null,
  isLoggedIn:  false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ userId: string; accessToken: string }>) {
      state.userId      = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn  = true;
    },
    clearAuth(state) {
      state.userId      = null;
      state.accessToken = null;
      state.isLoggedIn  = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;