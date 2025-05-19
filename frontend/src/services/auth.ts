import axios, { AxiosError } from "axios";
import { registerUserSocket } from "./socket";

import api from "./api";

export const signup = async (data: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("user/auth/signup", data);
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
    const response = await api.post("user/auth/login", data);

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
    const response = await api.post("user/auth/otp-verification", data);
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
    const response = await api.post("user/auth/resend-otp", data);
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
    const response = await api.post("user/auth/forgot-password", data);
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
    const response = await api.post("user/auth/reset-password", data);
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
    const response = await api.post(`user/auth/logout/${userId}`)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Logout Error:", error.response?.data);
    }
  }
};

export const googleLogin = () => {
  console.log("hello clicked ");
  window.open(`https://www.aspivo.site/api/user/google`, "_self");
};

export const fetchGoogleUser = async () => {
  try {
    const response = await axios.get(
      "https://www.aspivo.site/api/user/google/success",
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
