import axios, { AxiosError } from "axios";
import { data } from "react-router-dom";
const ADMIN_API = "http://localhost:5001/api/admin";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/admin-userManagement`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetching Error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const blockUser = async (userId: string) => {
  try {
    const response = await axios.patch(`${ADMIN_API}/block-user/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Blocking the user:", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const getAllCompany = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/companies`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
  }
};

export const updateCompanyStatus = async (
  comapnyId: string,
  action: string
) => {
  try {
    const data = { comapnyId, action };
    const response = await axios.post(`${ADMIN_API}/company-request`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
  }
};


export const  approvedCompany=async()=>{
  try {
    const response=await axios.get(`${ADMIN_API}/approved-company`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch approved  company:", error.response?.data);
    }
  }
}