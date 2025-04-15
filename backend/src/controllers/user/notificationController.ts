import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import { INotificationController } from "../../interface/controller/user/notificationControllerInterface.js";

export class NotificationController implements INotificationController {
  // private notificationService: NotificationService;

  // constructor() {
  //   this.notificationService = new NotificationService();
  // }

  constructor(private notificationService:NotificationService) {}

  public createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, message } = req.body;
      const notification = await this.notificationService.createNotification(userId, message);
      res.status(HttpStatus.CREATED).json(notification);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to create notification" });
    }
  };

  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const notifications = await this.notificationService.getNotifications(userId);
      res.status(HttpStatus.OK).json(notifications);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  public isRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { notificationId } = req.body;
      const response = await this.notificationService.isRead(userId, notificationId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };
}
