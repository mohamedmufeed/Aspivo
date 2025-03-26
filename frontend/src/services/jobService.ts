import { AxiosError } from "axios";
import api from "./api"; 


export const fetchJob=async({page,limit}:{page:number,limit:number})=>{
    try {
         const response= await api.get("user/jobs",{params:{page,limit}})
         return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Job fethcing :", error.response?.data);
          }
    }
}

export const getJobDetails= async(jobId:string)=>{
try {
    const response=await api.get(`user/job-details/${jobId}`)
    return response.data
    
} catch (error) {
    if (error instanceof AxiosError) {
        console.error("Job  details fethcing :", error.response?.data);
      }
}
}

export const applyForJob=async (jobId:string,userId:string)=>{
try {
    const data={userId}
    const response= await api.post(`user/applyjob/${jobId}`,data)
    return response.data
    
} catch (error) {
    if (error instanceof AxiosError) {
        console.error("apply job :", error.response?.data);
      }
}
}

export const appliedJobs=async(userId:string)=>{
    try {
        const response= await api.get(`user/applyed-jobs/${userId}`)
        return response
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("applied jobs  :", error.response?.data);
          }  
    }
}