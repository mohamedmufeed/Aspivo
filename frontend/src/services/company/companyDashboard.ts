import { AxiosError } from "axios";
import api from "../api"
import { parseWeekRange } from "../../utils/dasboardUtils";

export const getCompanyDashboardStats = async (comapnyId: string) => {
    try {
        const response = await api.get(`company/dashboard-status/${comapnyId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fetching comapny dashboard stats :", error.response?.data);
        }
    }
}

export const getCompanyApplicationByDate = async (comapnyId: string, startDate: string, endDate:string) => {
    try {
    const response=await api.get(`company/dashboard/application-status/${comapnyId}`,{
        params:{startDate,endDate}
    })
    return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fethching company application stats:", error.response?.data);
        }
    }
}