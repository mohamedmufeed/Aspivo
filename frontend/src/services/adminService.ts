import  { AxiosError } from "axios";
import api from "./api";

export const fetchUsers = async () => {
  try {
    const response = await api.get(`admin/users`);
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
    const response = await api.patch(`admin/users/${userId}/block`);
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
    const response = await api.get(`admin/companies`);
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
    const response = await api.post(`admin/companies/requests`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
  }
};

export const approvedCompany = async () => {
  try {
    const response = await api.get(`admin/companies/approved`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch approved  company:", error.response?.data);
    }
  }
};

export const addSkill = async (skills: any) => {
  try {
    const response = await api.post(`admin/skills`, skills);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("adding skill:", error.response?.data);
    }
  }
};

export const getSkills = async () => {
  try {
    const response = await api.get(`admin/skills`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting skill:", error.response?.data);
    }
  }
};

export const removeSkill = async (skillId: string) => {
  try {
    const response = await api.delete(`admin/skills/${skillId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("removing skill:", error.response?.data);
    }
  }
};

export const getSubcriptions=async()=>{
  try {
    const response=await api.get(`admin/subscriptions`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting subscriptions:", error.response?.data);
    }
  }
}
export const updateSubscriptionStatus = async (subscriptionId: string, { status }: { status: "active" | "inactive" | "cancelled" })=>{
  try {
    const response=await api.patch(`admin/subscriptions/${subscriptionId}/status`,{status})
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("updating subscription status subscriptions:", error.response?.data);
    }
  }
 }