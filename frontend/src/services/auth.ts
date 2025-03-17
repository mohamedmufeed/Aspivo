import axios, { AxiosError } from "axios";
import socket, { registerUserSocket } from "./socket";


import api from "./api"; 


export const signup = async (data: { userName: string; email: string; password: string }) => {
  try {
    const response = await api.post("/signup", data);
    const user=response.data
    registerUserSocket("User",user._id)
    return user
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Signup Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/login", data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Login Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  try {
    const response = await api.post("/otp-verification", data);
    console.log("the from api",response.data)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("OTP Verification Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resendOtp = async (data: { email: string }) => {
  try {
    const response = await api.post("/resend-otp", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Resend OTP Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await api.post("/forgot-password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Forgot Password Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resetPassword = async (data: { email: string; newPassword: string }) => {
  try {
    const response = await api.post("/reset-password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Reset Password Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const logout = async () => {
  try {
    await api.post("/logout"); 

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Logout Error:", error.response?.data);
    }
  }
};

export const googleLogin = () => {
  console.log("hello clicked ")
  window.open(`http://localhost:5001/api/user/google`, "_self");

};


  export const fetchGoogleUser= async()=>{
    try {
      const response=await axios.get("http://localhost:5001/api/user/google/success",{
        withCredentials:true
      })
      console.log("Google Auth Response:", response); 
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Login Error:", error.response?.data);
      }
    }
  }




