import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickname: null,
  email: null,
  avatar: null,
  state: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickname: payload.nickname,
      email: payload.email,
      avatar: payload.avatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      state: payload.state,
    }),
    authLogout: () => initialState,
    updateAvatarAction: (state, { payload }) => ({
      ...state,
      avatar: payload.avatar,
    }),
  },
});
