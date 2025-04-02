import { AxiosError } from "axios";
import api from "../api";

export const getComapny = async (companyId: string) => {
  try {
    const response = await api.get(`company/company-profile/${companyId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Geting company profile:", error.response?.data);
    }
  }
};
