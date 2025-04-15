import axios, { AxiosError } from "axios";
const ADMIN_API = "http://localhost:5001/api/admin";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/users`);
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
    const response = await axios.patch(`${ADMIN_API}/users/${userId}/block`);
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
    const response = await axios.post(`${ADMIN_API}/companies/requests`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
  }
};

export const approvedCompany = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/companies/approved`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch approved  company:", error.response?.data);
    }
  }
};

export const addSkill = async (skills: any) => {
  try {
    const response = await axios.post(`${ADMIN_API}/skills`, skills);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("adding skill:", error.response?.data);
    }
  }
};

export const getSkills = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/skills`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting skill:", error.response?.data);
    }
  }
};

export const removeSkill = async (skillId: string) => {
  try {
    const response = await axios.delete(`${ADMIN_API}/skills/${skillId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("removing skill:", error.response?.data);
    }
  }
};

export const getSubcriptions=async()=>{
  try {
    const response=await axios.get(`${ADMIN_API}/subscriptions`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting subscriptions:", error.response?.data);
    }
  }
}
export const updateSubscriptionStatus = async (subscriptionId: string, { status }: { status: "active" | "inactive" | "cancelled" })=>{
  try {
    const response=await axios.patch(`${ADMIN_API}/subscriptions/${subscriptionId}/status`,{status})
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("updating subscription status subscriptions:", error.response?.data);
    }
  }
 }