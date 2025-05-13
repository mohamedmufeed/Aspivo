
import { ConversationResponse, MessageRepostries } from "../repositories/messageRepostries";
import { createClient } from "redis";
import { io } from "../server";
import Conversation from "../models/conversations";
import IMessageService from "../interface/service/user/messageServiceInterface";
import logger from "../logger";
import dotenv from "dotenv";
dotenv.config();
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) =>  logger.info("Redis client error", err));

export class MessageService implements IMessageService {

  constructor(private _messageRepositories: MessageRepostries) { }

  async initializeChat(
    initiatorId: string,
    targetId: string,
    role: "company" | "employee"
  ) {
    await redisClient.connect();
    const channel =
      role === "company"
        ? `chat:${initiatorId}:${targetId}`
        : `chat:${targetId}:${initiatorId}`;
    await redisClient.set(`chat:room:${initiatorId}:${targetId}`, "active");
    const conversation = new Conversation({
      channel,
      participants: [
        { userId: initiatorId, role: role },
        { userId: targetId, role: role === "company" ? "employee" : "company" },
      ],
      lastMessage: "Chat initialized",
      timestamp: new Date(),
      unread: true,
    });
    await conversation.save();
    await redisClient.disconnect();
    return { channel, message: "Chat initialized" };
  }


  async sendChatMessage(channel: string, message: string, senderId: string) {
    await redisClient.connect();
    try {
      const payload = JSON.stringify({
        channel:channel,
        senderId:senderId,
        message:message,
        timeStamp: new Date().toISOString(),
      });
  
      
      if (io) {
        io.to(channel).emit("receiveMessage", payload);
      } else {
        await redisClient.publish(channel,  JSON.stringify(payload)); 
      }
  
      const senderInfo = await this._messageRepositories.findSender(senderId);

      if (!senderInfo) {
        throw { status: 404, message: "Sender not found" };
      }
      const { type, data: sender } = senderInfo;
      await this._messageRepositories.markConversationUnread(channel, senderId);
      if(type === "user"){
        if (sender?.features.unlimitedChat) {
          await this._messageRepositories.createChat(channel, senderId, message);
        } else if (sender!.chatLimit > 0) {
          await this._messageRepositories.decrementChatLimit(senderId);
          await this._messageRepositories.createChat(channel, senderId, message);
        } else {
          throw { status: 404, message: "Message Limit ends" };
        }
      }else if( type === "company"){
        await this._messageRepositories.createChat(channel, senderId, message);
      }
   
    } finally {
      await redisClient.disconnect();
    }
  }
  
  

  async subscribeToChat(channel: string, callback: (message: string) => void) {
    if (io) {
      io.on("connection", (socket) => {
        socket.join(channel)
        socket.on("receiveMessage", (data) => callback(JSON.stringify(data)))
      })
    } else {
      redisClient.connect();
      redisClient.subscribe(channel, callback);
    }

  }

  async unsubscribeFromChat(channel: string) {
    if (io) {
      io.socketsLeave(channel)
    } else {
      redisClient.unsubscribe(channel);
    }

  }

  async getHistory(channel: string) {
    await redisClient.connect();
    const messages = await this._messageRepositories.findChat(channel);
    await redisClient.disconnect();
    return messages.map((msg) => ({
      senderId: msg.senderId,
      message: msg.message,
      timestamp: msg.timestamp.toISOString(),
    }));
  }
  async getConversations(userId: string, role: string): Promise<ConversationResponse[]> {
    const conversations = await this._messageRepositories.getConversations(
      userId,
      role
    );
    return conversations;
  }

  async markConversationAsRead(channel: string, userId: string) {
    await this._messageRepositories.markConversationRead(channel, userId);
  }
  async getUnreadMessageCount(userId:string){
   const count= await this._messageRepositories.getUnreadMessageCount(userId)
   return {count, message:"Unread message count get suscsess full"}
  }
}
