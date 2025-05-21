import { AxiosError } from "axios";
import api from "../api"
import { COMPANY_BASE_ROUTE } from "../../constants/apiRoutes";

export const getCompanyDashboardStats = async (comapnyId: string) => {
    try {
        const response = await api.get(`${COMPANY_BASE_ROUTE}/dashboard-status/${comapnyId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fetching comapny dashboard stats :", error.response?.data);
        }
    }
}

export const getCompanyApplicationByDate = async (comapnyId: string, startDate: string, endDate:string) => {
    try {
    const response=await api.get(`${COMPANY_BASE_ROUTE}/dashboard/application-status/${comapnyId}`,{
        params:{startDate,endDate}
    })
    return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fethching company application stats:", error.response?.data);
        }
    }
}


 export const getMostAppliedJobs=async(companyId:string)=>{
try {
    const response=await api.get(`${COMPANY_BASE_ROUTE}/dashboard/most-appliedjobs/${companyId}`)
    return response.data
} catch (error) {
    if (error instanceof AxiosError) {
        console.error("Error fethching most applied jobs stats:", error.response?.data);
    }
}
 }