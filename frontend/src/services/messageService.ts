import { AxiosError } from "axios";
import api from "./api";
export const getConversations = async (id: string, role: string) => {
    try {
        const response = await api.get(`message/approved-conversations`, {
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
        const response = await api.get(`message/chat-history`, {
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
        const response = await api.post(`message/send-message`, {
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
        const response=await api.post(`message/initialize-chat`,{
            initiatorId,targetId,role
        })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(" error InitializeChat", error.response?.data);
        }
    }
}