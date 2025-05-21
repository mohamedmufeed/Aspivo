
import { COMPANY_BASE_ROUTE } from "../../constants/apiRoutes";
import { IMeetingData } from "../../types/types";
import api from "../api";
import { AxiosError } from "axios";

export const sheduleMeeting = async (meetingData: IMeetingData) => {
    try {
        const response = await api.post(`${COMPANY_BASE_ROUTE}/meetings`, meetingData)
         return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error Shedule Meeting :", error.response?.data);
        }
    }
}


export const getMeetings=async(companyId:string)=>{
    try {
        const response=await api.get(`${COMPANY_BASE_ROUTE}/meetings/${companyId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fetching sheduled meetings :", error.response?.data);
        }
    }
}