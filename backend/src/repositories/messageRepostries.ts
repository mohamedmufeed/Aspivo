
import ChatMessage from "../models/chat.js";
import Conversation from "../models/conversations.js";
import User from "../models/user.js";
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
 return await ChatMessage.find({channel}).sort({timeStamp:1})    
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
                console.warn(`Failed to fetch name for ${otherParticipant?.userId}:`, fetchError);
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

}
