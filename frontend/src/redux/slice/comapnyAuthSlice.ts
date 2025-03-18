import { createSlice } from "@reduxjs/toolkit";

interface Company {
  _id: string;
  companyName: string;
  email: string;
  logo?: string; 
}


interface CompanyAuthState {
  company: Company | null;
}

const companyAuthSlice = createSlice({
  name: "companyauth",
  initialState: {
    company: null,
    token: null,
  } as CompanyAuthState,
  reducers: {
    register: (state, action) => {
      state.company = {
        _id: action.payload.company._id,
        companyName: action.payload.company.companyName,
        email: action.payload.company.email,
        logo: action.payload.company.kyc || undefined,
      };
    }
  
  },
});

export const { register } = companyAuthSlice.actions; 
export default companyAuthSlice.reducer;
