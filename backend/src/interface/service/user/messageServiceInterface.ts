import { MessageResponse } from "../../../types/interfaceTypes";
import { ConversationResponse } from "../../../repositories/messageRepostries";
export default interface IMessageService{
    initializeChat(initiatorId:string,targetId:string,role:"company" | "employee"):Promise<MessageResponse>
    sendChatMessage(channel:string,message:string,senderId:string):Promise<void>
    subscribeToChat(channel:string,callback: (message: string) => void):Promise<void>
    unsubscribeFromChat(channel:string):Promise<void>
    getConversations(userId:string,role:string):Promise<ConversationResponse[]>
    getUnreadMessageCount(userId:string):Promise<{count: { _id: string; unreadCount: number; }[]; message: string}>
}