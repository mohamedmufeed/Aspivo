
import logger from "../logger";
import ChatMessage from "../models/chat";
import Company from "../models/company";
import Conversation from "../models/conversations";
import User from "../models/user";
import { SenderInfo } from "../types/companyTypes";
 export  interface ConversationResponse {
    targetId: string | undefined;
    targetName: string;
    targetProfile:string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    channel: string;
}

export class MessageRepostries {
  async createChat(channel: string, senderId: string, message: string) {
    const chat= new ChatMessage({
      channel,
      senderId,
      message,
      timestamp: new Date(),
    });
    await chat.save()
    let conversation = await Conversation.findOne({ channel });
        if (!conversation) {
            const [firstParticipant, secondParticipant] = channel.split(":")[1].split(":");
            const role = senderId.startsWith("company") ? "company" : "employee";
            conversation = new Conversation({
                channel,
                participants: [
                    { userId: firstParticipant, role: role === "company" ? "company" : "employee" },
                    { userId: secondParticipant, role: role === "employee" ? "company" : "employee" },
                ],
            });
        }
        conversation.lastMessage = message;
        conversation.timestamp = new Date();
        await conversation.save();
  }
  async findChat(channel:string){
    return await ChatMessage.find({ channel }).sort({ timestamp: 1 });

  }
  async getConversations(userId: string, role: string): Promise<ConversationResponse[]> {
    const conversations = await Conversation.find({
        "participants.userId": userId,
        "participants.role": role,
    }).sort({ timestamp: -1 });

    const enhancedConversations = await Promise.all(
        conversations.map(async (conv) => {
            const otherParticipant = conv.participants.find(p => p.userId !== userId);
            let targetName = otherParticipant?.userId || "Unknown"; 
            try {
                const user = await User.findById(otherParticipant?.userId).select("firstName lastName");
                if (user) {
                    targetName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || targetName;
                }
            } catch (fetchError) {
                logger.warn(`Failed to fetch name for ${otherParticipant?.userId}:`, fetchError);
            }
            return {
                targetId: otherParticipant?.userId,
                targetName,
                lastMessage: conv.lastMessage || "",
                timestamp: conv.timestamp.toISOString(),
                unread: conv.unread || false,
                channel: conv.channel || "",
            } as ConversationResponse;
        })
    );

    return enhancedConversations;
}



async findSender(id: string):Promise<SenderInfo> {
    const user = await User.findById(id);
    if (user) return { type: "user", data: user };
  
    const company = await Company.findById(id);
    if (company) return { type: "company", data: company };
  
    return null;
  }
  

async decrementChatLimit(id: string) {
    return await User.findByIdAndUpdate(
      id,
      { $inc: { chatLimit: -1 } },
      { new: true } 
    );
  }

  async markConversationUnread(channel: string, senderId: string) {
    try {
      const parts = channel.split(':');
      if (parts.length !== 3) return;
      
      const participantA = parts[1];
      const participantB = parts[2];
    
      const recipientId = senderId === participantA ? participantB : participantA;
      const conversation = await Conversation.findOne({ channel });
      if (!conversation) return;
      
      const recipientParticipant = conversation.participants.find(p => p.userId === recipientId);
      if (!recipientParticipant) return;

      await Conversation.updateOne(
        { channel },
        { unread: true }
      );
    } catch (error) {
      logger.error("Error marking conversation as unread:", error);
    }
  }

  async markConversationRead(channel: string, userId: string) {
    try {
      await Conversation.updateOne(
        { channel },
        { unread: false }
      );
    } catch (error) {
      logger.error("Error marking conversation as read:", error);
    }
  }
  
}
