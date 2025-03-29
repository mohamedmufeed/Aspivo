import axios, { AxiosError } from "axios";
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

export const approvedCompany = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/approved-company`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch approved  company:", error.response?.data);
    }
  }
};

export const addSkill = async (skills: any) => {
  try {
    const response = await axios.post(`${ADMIN_API}/add-skill`, skills);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("adding skill:", error.response?.data);
    }
  }
};

export const getSkills = async () => {
  try {
    const response = await axios.get(`${ADMIN_API}/get-skills`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting skill:", error.response?.data);
    }
  }
};

export const removeSkill = async (skillId: string) => {
  try {
    const response = await axios.delete(`${ADMIN_API}/remove-skill/${skillId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("removing skill:", error.response?.data);
    }
  }
};
