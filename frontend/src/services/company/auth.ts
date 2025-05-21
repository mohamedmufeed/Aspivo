import  { AxiosError } from "axios";
import api from "../api";
import { COMPANY_BASE_ROUTE } from "../../constants/apiRoutes";
export const signup = async (
  companyName: string,
  email: string,
  kyc: string,
  userId: string
) => {
  try {
    const data = { companyName, email, kyc };
    const response = await api.post(`${COMPANY_BASE_ROUTE}/auth/signup/${userId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("company signup Error:", error.response?.data);
    }
  }
};



