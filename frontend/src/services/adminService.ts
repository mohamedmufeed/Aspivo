import { AxiosError } from "axios";
import api from "./api";
import { parseWeekRange } from "../utils/dasboardUtils";
import { ADMIN_BASE_ROUTE } from "../constants/apiRoutes";

export const fetchUsers = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/users`, {
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
export const getAllCompany = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/companies`, {
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
    const response = await api.patch(`${ADMIN_BASE_ROUTE}/users/${userId}/block`);
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
    const response = await api.post(`${ADMIN_BASE_ROUTE}/companies/requests`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
  }
};

export const approvedCompany = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/companies/approved`, {
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

export const addSkill = async (skills: { skills: string[]; }) => {
  try {
    const response = await api.post(`${ADMIN_BASE_ROUTE}/skills`, skills);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("adding skill:", error.response?.data);
    }
  }
};

export const getSkills = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/skills`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("geting skill:", error.response?.data);
    }
  }
};

export const removeSkill = async (skillId: string) => {
  try {
    const response = await api.delete(`${ADMIN_BASE_ROUTE}/skills/${skillId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("removing skill:", error.response?.data);
    }
  }
};

export const getSubcriptions = async (page = 1, limit = 5, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/subscriptions`, {
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
    const response = await api.patch(`${ADMIN_BASE_ROUTE}/subscriptions/${subscriptionId}/status`, { status })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("updating subscription status subscriptions:", error.response?.data);
    }
  }
}

export const getDashboardStats = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/dashboard-stats`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching dashbord stats:", error.response?.data);
    }
  }
}

export const getWeeklyApplicationData = async (date: string) => {
  const { startDate, endDate } = parseWeekRange(date)
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/dashboard-application-status`, { params: { startDate, endDate } })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching weekly application data :", error.response?.data);
    }
  }
}

export const getMonthlySubscriptionRevenue = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE_ROUTE}/dashboard-revenue-status`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching Monthly Revenue data :", error.response?.data);
    }
  }
}

export const downloadExcel = async (date:string,type: "ApplicationData" | "RevenueData") => {
  const { startDate, endDate } = parseWeekRange(date)
  try {
    const response = await api.get(`/${ADMIN_BASE_ROUTE}/dashboard/download-excel`, {
      params: { startDate, endDate, type },
      responseType: "blob", 
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${type}-report.xlsx`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error downloading Excel:", error.response?.data);
    }
  }
};