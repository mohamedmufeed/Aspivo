import { Request, Response } from "express";

export interface INotificationController {
  createNotification(req: Request, res: Response): Promise<void>;
  getNotifications(req: Request, res: Response): Promise<void>;
  isRead(req: Request, res: Response): Promise<void>;
}
