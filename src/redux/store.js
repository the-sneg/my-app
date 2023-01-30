import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authReducer";
import { pathSlice } from "./path/pathReducer";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [pathSlice.name]: pathSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
