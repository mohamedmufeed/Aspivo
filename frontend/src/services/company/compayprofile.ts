import axios, { AxiosError } from "axios";
const COMPANY_URI = "http://localhost:5001/api/company";


export const fetchCompany= async (userId:string)=>{
try {
    const response = await axios.get(`${COMPANY_URI}/company/${userId}`)
    return response.data
    
} catch (error) {
    if (error instanceof AxiosError) {
        console.error("Comapny fething Error", error.response?.data);
      }
}
}

