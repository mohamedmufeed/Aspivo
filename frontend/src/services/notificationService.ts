import { AxiosError } from "axios";
import api from "./api"; 

export const getNotifications=async(userId:string)=>{
try {
    const response=  await api.get(`/notifications/${userId}`)
    return  response.data
    
} catch (error) {
     if (error instanceof AxiosError) {
      console.error("Fetch company:", error.response?.data);
    }
}
}