import { createSlice } from "@reduxjs/toolkit";
interface Experience {
  _id?: string;
  title: string;
  employmentType: string;
  company: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  currentlyWorking?: boolean;
}
interface Usertype {
  user: { _id: string; userName: string; profileImage: string ,experiences:Experience[]} | null;
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
          experiences: action.payload.experiences || [],
          } ;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token; 
    },
    logout: (state) => {
      state.user = null;
      state.email = null;
      state.isAdmin = false;
      state.token = null;
    },
    addExperience: (state, action) => {
      if (state.user) {
        state.user.experiences = [...(state.user.experiences || []), action.payload]; 
      }
    },
  
    editExperience:(state,action)=>{
      if(state.user){
        state.user.experiences=state.user.experiences.map((exp)=>
          exp._id===action.payload._id ?action.payload:exp
        )
      }
    }
  },
});

export const { login, logout ,addExperience,editExperience} = authSlice.actions;
export default authSlice.reducer;
