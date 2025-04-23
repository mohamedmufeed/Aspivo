import axios, { AxiosError } from "axios";
const COMPANY_URI = "http://localhost:5001/api/company";

export const signup = async (
  companyName: string,
  email: string,
  kyc: string,
  userId: string
) => {
  try {
    const data = { companyName, email, kyc };
    const response = await axios.post(`${COMPANY_URI}/auth/signup/${userId}`, data);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("company signup Error:", error.response?.data);
    }
  }
};



