import { AxiosError } from "axios";
import api from "./api"; 
import { USER_BASE_ROUTE } from "../constants/apiRoutes";

export const getNotifications=async(userId:string)=>{
try {
    const response=  await api.get(`${USER_BASE_ROUTE}/users/${userId}/notifications`)
    return  response.data
    
} catch (error) {
     if (error instanceof AxiosError) {
      console.error("Fetch Notification:", error.response?.data);
    }
}
}

export const updateNotification=async(userid:string,notificationId:string)=>{
    try {
        const data={notificationId:notificationId}
        const response= await api.patch(`${USER_BASE_ROUTE}/users/${userid}/notifications`,data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Updating Notification:", error.response?.data);
          }
    }
}