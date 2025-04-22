import { AxiosError } from "axios";
import api from "./api";

export const fetchUsers = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`admin/users`, {
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal // This allows the request to be aborted if needed
    });
    return response.data;
  } catch (error) {
    // Don't throw errors for aborted requests
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

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
export const getAllCompany = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`admin/companies`, {
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal
    });
    return response.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

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

export const approvedCompany = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`admin/companies/approved`, {
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal
    });
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

export const getSubcriptions = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`admin/subscriptions`,{
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting subscriptions:", error.response?.data);
    }
  }
}
export const updateSubscriptionStatus = async (subscriptionId: string, { status }: { status: "active" | "inactive" | "cancelled" }) => {
  try {
    const response = await api.patch(`admin/subscriptions/${subscriptionId}/status`, { status })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("updating subscription status subscriptions:", error.response?.data);
    }
  }
}