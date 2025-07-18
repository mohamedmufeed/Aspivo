import axios, { AxiosError } from "axios";
import { registerUserSocket } from "./socket";

import api from "./api";
import { USER_BASE_ROUTE } from "../constants/apiRoutes";
const isProduction = window.location.hostname !== "localhost";
const  GOOGLE_URL= isProduction ? "https://www.aspivo.site/api/user/google" :"http://localhost:5001/api/user/google"

export const signup = async (data: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/signup`, data);
    const user = response.data;
    registerUserSocket("User", user._id);
    return user;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Signup Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/login`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Login Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again. ",
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/otp-verification`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("OTP Verification Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resendotp = async (data: { email: string }) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/resend-otp`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Resend OTP Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/forgot-password`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Forgot Password Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/reset-password`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Reset Password Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const logoutUser = async (userId: string) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/auth/logout/${userId}`)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Logout Error:", error.response?.data);
    }
  }
};

export const googleLogin = () => {
  console.log("hello clicked ");
  window.open(`${GOOGLE_URL}`, "_self");
};

export const fetchGoogleUser = async () => {
  try {
    const response = await axios.get(
      `${GOOGLE_URL}/success`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Login Error:", error.response?.data);
    }
  }
};
