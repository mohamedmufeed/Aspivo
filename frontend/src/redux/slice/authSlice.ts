import { createSlice } from "@reduxjs/toolkit";
interface Usertype {
  user: { _id: string; userName: string; profileImage: string } | null;
  email: string | null;
  isAdmin: boolean;
  token: string | null;
}


const authSlice = createSlice({
  name: "auth",
  initialState:<Usertype> { user: null, email: null, isAdmin: false, token: null },
  reducers: {
    login: (state, action) => {
      state.user = {
        _id:action.payload._id,
         userName: action.payload.userName ,
           profileImage: action.payload.profileImage ,
          } ;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token; 
      localStorage.setItem("token", action.payload.token); 
    },
    logout: (state) => {
      state.user = null;
      state.email = null;
      state.isAdmin = false;
      state.token = null;
      localStorage.removeItem("token"); 
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
