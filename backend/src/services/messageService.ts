
import { MessageRepostries } from "../repositories/messageRepostries";
import { createClient } from "redis";
import { io } from "../server";
import Conversation from "../models/conversations";

const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.on("error", (err) => console.log("Redis client error", err));
export class MessageService {
  private messageRepositories: MessageRepostries;

  constructor() {
    this.messageRepositories = new MessageRepostries();
  }

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
    const payload = JSON.stringify({
      senderId,
      message,
      timeStamp: new Date().toISOString(),
    });

    if(io){
      io.to(channel).emit("receiveMessage",payload)
    }else{
      console.warn("Socket.IO not initialized, falling back to Redis");
      await redisClient.publish(channel,JSON.stringify(payload));
    }
    await this.messageRepositories.createChat(channel, senderId, message);
    await redisClient.disconnect();
  }

  async subscribeToChat(channel: string, callback: (message: string) => void) {
    if(io){
      io.on("connection",(socket)=>{
        socket.join(channel)
        socket.on("receiveMessage",(data)=>callback(JSON.stringify(data)))
      })
    }else{
      redisClient.connect();
      redisClient.subscribe(channel, callback);
    }
  
  }

  async unsubscribeFromChat(channel: string) {
    if(io){
      io.socketsLeave(channel)
    }else{
      redisClient.unsubscribe(channel);
    }

  }

  async getHistory(channel: string) {
    await redisClient.connect();
    const messages = await this.messageRepositories.findChat(channel);
    await redisClient.disconnect();
    return messages.map((msg) => ({
      senderId: msg.senderId,
      message: msg.message,
      timestamp: msg.timestamp.toISOString(),
    }));
  }
  async getConversations(userId: string, role: string) {
    const conversations = await this.messageRepositories.getConversations(
      userId,
      role
    );
    return conversations;
  }
}
