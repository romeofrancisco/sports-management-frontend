import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      if (action.payload?.user && action.payload?.tokens) {
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access_token || null;
        state.refreshToken = action.payload.tokens.refresh_token || null;
      } else {
        state.user = action.payload;
      }
      state.isAuthenticated = true;
    },
    setTokens(state, action) {
      state.accessToken = action.payload?.accessToken || null;
      state.refreshToken = action.payload?.refreshToken || null;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: () => initialState,
  },
});

export const { login, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
