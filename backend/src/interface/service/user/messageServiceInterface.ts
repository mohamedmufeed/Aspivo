import { MessageResponse } from "../../../types/interfaceTypes";
import { ConversationResponse } from "../../../repositories/messageRepostries";
export default interface IMessageService{
    initializeChat(initiatorId:string,targetId:string,role:"company" | "employee"):MessageResponse
    sendChatMessage(channel:string,message:string,senderId:string):void
    subscribeToChat(channel:string,callback: (message: string) => void):void
    unsubscribeFromChat(channel:string):void
    getConversations(userId:string,role:string):ConversationResponse
}