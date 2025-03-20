import { AxiosError } from "axios";
import api from "./api"; 


export const fetchJob=async({page,limit}:{page:number,limit:number})=>{
    try {
         const response= await api.get("/jobs",{params:{page,limit}})
         return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Job fethcing :", error.response?.data);
          }
    }
}