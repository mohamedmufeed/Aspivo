import {  Request, Response } from "express";
import { MessageService } from "../../services/messageService";
import HttpStatus from "../../utils/httpStatusCode";
import User from "../../models/user";
import { ConversationResponse } from "../../repositories/messageRepostries";
import Company from "../../models/company";
import { IMessageController } from "../../interface/controller/user/messageControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import logger from "../../logger";

export class MessageController  implements IMessageController{
    constructor(private _messageService: MessageService) {}

  initializeChatController = async (req: Request, res: Response ): Promise<void> => {
    try {
      const { initiatorId, targetId, role } = req.body;
      if (!initiatorId || !targetId || !role) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "initiatorId, targetId, and role are required" });
        return;
      }
      const channel = await this._messageService.initializeChat(initiatorId, targetId, role);
      res.status(HttpStatus.OK).json(channel);
    } catch (error) {
      logger.error("Error from initializeChatController:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  getApprovedConversations = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, role } = req.query;
      if (!userId || !role) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "userId and role are required" });
        return;
      }

      const conversations: ConversationResponse[] = await this._messageService.getConversations(userId as string, role as string);
      const enhancedConversations = await Promise.all(
        conversations.map(async (conv) => {
          let targetName = conv.targetId;
          let targetProfile = "";
          try {
            if (role === "employee") {
              const company = await Company.findById(conv.targetId).select("companyName logo");
              if (company && company.companyName) targetName = company.companyName;
              if (company?.logo) targetProfile = company.logo;
            } else if (role === "company") {
              const user = await User.findById(conv.targetId).select("firstName lastName profileImage");
              if (user) targetName = `${user.firstName} ${user.lastName}`;
              if (user) targetProfile = user.profileImage;
            }
          } catch (error) {
            logger.warn(`Failed to fetch name for ${conv.targetId} (role: ${role}):`, error);
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
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR});
    }
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { channel, message, senderId } = req.body;
      if (!channel || !message || !senderId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Channel, message, and senderId are required" });
        return;
      }
      await this._messageService.sendChatMessage(channel, message, senderId);
      res.status(HttpStatus.OK).json({ message: "Message sent" });
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR});
    }
  };

  getChatHistoryController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { channel } = req.query;
      if (!channel) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Channel is required" });
        return;
      }
      const history = await this._messageService.getHistory(channel as string);
      res.status(HttpStatus.OK).json(history);
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR});
    }
  };

  markConversationRead = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("helllllllllooooooo")
      const { channel, userId } = req.body;
      
      if (!channel || !userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Channel and userId are required" });
        return;
      }
      
      await this._messageService.markConversationAsRead(channel, userId);
      res.status(HttpStatus.OK).json({ message: "Conversation marked as read" });
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        message: err.message || ERROR_MESSAGES.SERVER_ERROR
      });
    }
  };
}
