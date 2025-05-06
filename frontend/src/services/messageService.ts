import { AxiosError } from "axios";
import api from "./api";
export const getConversations = async (id: string, role: string) => {
    try {
        const response = await api.get(`message/chats/approved`, {
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
        const response = await api.get(`message/chats/messages`, {
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
        const response = await api.post(`message/chats/messages`, {
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
        const response=await api.post(`message/chats`,{
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
      const response = await api.post('message/chats/markRead', { channel, userId });
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  };