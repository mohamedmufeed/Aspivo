import { Response, Request } from "express";
import { MessageService } from "../../services/messageService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import User from "../../models/user.js";
import { ConversationResponse } from "../../repositories/messageRepostries.js";
import Company from "../../models/company.js";
import { use } from "passport";
const messageService = new MessageService()
export const initializeChatController = async (req: Request, res: Response) => {
    try {
        const { initiatorId, targetId, role } = req.body
        if (!initiatorId || !targetId || !role) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "initiatorId, targetId, and role are required" })
        }
        const channel = await messageService.initializeChat(initiatorId, targetId, role)
        res.status(HttpStatus.OK).json(channel)

    } catch (error) {
        console.log("the error from the inti ",error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const getApprovedConversations = async (req: Request, res: Response) => {
    try {
        const { userId, role } = req.query;
        if (!userId || !role) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "userId and role are required" });
            return;
        }

        const conversations: ConversationResponse[] = await messageService.getConversations(userId as string, role as string);
        const enhancedConversations = await Promise.all(
            conversations.map(async (conv) => {
                let targetName = conv.targetId;
                let targetProfile=""
                try {
                    if (role === "employee") {
                        const company = await Company.findById(conv.targetId).select("companyName logo"); 
                        if (company && company.companyName) targetName = company.companyName;
                        if(company?.logo)targetProfile=company.logo
                    } else if (role === "company") {
                        const user = await User.findById(conv.targetId).select("firstName lastName profileImage");
                        if (user) targetName = `${user.firstName} ${user.lastName}`;
                        if(user)targetProfile=user.profileImage
                    }
                } catch (error) {
                    console.warn(`Failed to fetch name for ${conv.targetId} (role: ${role}):`, error);
                }

                return {
                    ...conv,
                    targetName,
                    targetProfile
        
                };
            })
        );

        res.status(HttpStatus.OK).json(enhancedConversations);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { channel, message, senderId } = req.body;
        if (!channel || !message || !senderId) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: "Channel, message, and senderId are required" });
         return
        }
        await messageService.sendChatMessage(channel, message, senderId);
        res.status(HttpStatus.OK).json({ message: "Message sent" });
    } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal server error" });
    }
}

export const getChatHistoryController = async (req: Request, res: Response) => {
    try {
        const { channel } = req.query;
        if (!channel) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Channel is required" });
            return
        }
        const history = await messageService.getHistory(channel as string);
        res.status(HttpStatus.OK).json(history);
    } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal server error" });
    }
}