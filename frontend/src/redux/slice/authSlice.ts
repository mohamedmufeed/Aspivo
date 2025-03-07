import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, email: null, isAdmin: false },
  reducers: {
    login: (state, action) => {
      
      state.user = action.payload.userName;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.user = null;
      state.email = null;
      state.isAdmin = false;
    },
  },
});

export const {login,logout}= authSlice.actions
export  default authSlice.reducer