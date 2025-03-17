import { createSlice } from "@reduxjs/toolkit";


const companyAuthSlice = createSlice({
  name: "companyauth",
  initialState:{ company: null, email: null, token: null },
  reducers: {
    login: (state, action) => {
      state.company = action.payload.company; 
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
  },
});

export const { login } = companyAuthSlice.actions; 
export default companyAuthSlice.reducer;
