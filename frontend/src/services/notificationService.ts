import { AxiosError } from "axios";
import api from "./api"; 

export const getNotifications=async(userId:string)=>{
try {
    const response=  await api.get(`user/users/${userId}/notifications`)
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
        const response= await api.patch(`user/users/${userid}/notifications`,data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Updating Notification:", error.response?.data);
          }
    }
}