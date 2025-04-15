import { Request, Response } from "express";


export interface IMessageController {
  initializeChatController(req: Request, res: Response): Promise<void>;
  getApprovedConversations(req: Request, res: Response): Promise<void>;
  sendMessage(req: Request, res: Response): Promise<void>;
  getChatHistoryController(req: Request, res: Response): Promise<void>;
}
