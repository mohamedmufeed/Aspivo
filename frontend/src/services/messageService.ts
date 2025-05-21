import { AxiosError } from "axios";
import api from "./api";
import { MESSAGE_BASE_ROUTE } from "../constants/apiRoutes";
export const getConversations = async (id: string, role: string) => {
    try {
        const response = await api.get(`${MESSAGE_BASE_ROUTE}/chats/approved`, {
            params: { userId: id, role: role },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("fetching conversations:", error.response?.data);
        }
    }
};

export const getMessageHistory = async (channel: string) => {
    try {
        const response = await api.get(`${MESSAGE_BASE_ROUTE}/chats/messages`, {
            params: { channel },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("fetching history", error.response?.data);
        }
    }
};


export const sendMessage = async (channel: string, message: string, senderId: string,imageUrl?:string) => {
    try {
        const response = await api.post(`${MESSAGE_BASE_ROUTE}/chats/messages`, {
            channel, message, senderId,
            imageUrl
        })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("send message", error.response?.data);
        }
    }
}


export const InitializeChat=async(initiatorId:string,targetId:string,role:string)=>{
    try {
        const response=await api.post(`${MESSAGE_BASE_ROUTE}/chats`,{
            initiatorId,targetId,role
        })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(" error InitializeChat", error.response?.data);
        }
    }
}


export const markConversationAsRead = async (channel:string, userId:string) => {
    try {
      const response = await api.post(`${MESSAGE_BASE_ROUTE}/chats/markRead`, { channel, userId });
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  };


  export const getUnreadMessageCount=async(userId:string)=>{
    try {
        const response=await api.get(`${MESSAGE_BASE_ROUTE}/chats/unreadcount/${userId}`)
        return response.data
    } catch (error) {
           console.error('Error  Geting unread message count read:', error);
      throw error;
    }
  }