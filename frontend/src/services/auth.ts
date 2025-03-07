import axios, { AxiosError } from "axios";
const USER_API = "http://localhost:5001/api/user";

export const signup = async (data: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${USER_API}/signup`, data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("UserToken", token);
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response?.status) {
        console.error("Signup Error:", error?.response?.data);
      }
    }
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${USER_API}/login`, data);
    const token = response.data.token;

    if (!response.data.isAdmin) {
      localStorage.setItem("UserToken", token);
    } else {
      localStorage.setItem("AdminToken", token);
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response?.status) {
        console.error("Login Error:", error?.response?.data);
      }
    }
  }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  try {
    const response = await  axios.post(`${USER_API}/otp-verification`,data);
    console.log(response)
    return  response.data


  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response?.status) {
        console.error("Otp verification :", error?.response?.data);
      }
    }
    return null; 
  }



};

export const resendotp= async (data:{email:string})=>{
    try {
      const response = await axios.post(`${USER_API}/resend-otp`,data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status) {
          console.error("Otp verification :", error?.response?.data);
        }
      }
      return null
    }
}


 export const forgotPassword = async (data:{email:string})=>{
  try {
    const response = await axios.post(`${USER_API}/forgot-password`,data)
    return response.data
    
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response?.status) {
        console.error("Otp verification :", error?.response?.data);
      }
    }
    return null
  }
 }

  export const resetPassword = async (data:{email:string,newPassword:string})=>{
  try {
    const response= await axios.post(`${USER_API}/reset-password`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response?.status) {
        console.error("Otp verification :", error?.response?.data);
      }
    }
    return null
  }

  }