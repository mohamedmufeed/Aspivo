import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService";
import HttpStatus from "../../utils/httpStatusCode";
import { INotificationController } from "../../interface/controller/user/notificationControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";

export class NotificationController implements INotificationController {
  // private notificationService: NotificationService;

  // constructor() {
  //   this.notificationService = new NotificationService();
  // }

  constructor(private _notificationService:NotificationService) {}

  public createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, message } = req.body;
      const notification = await this._notificationService.createNotification(userId, message);
      res.status(HttpStatus.CREATED).json(notification);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to create notification" });
    }
  };

  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const notifications = await this._notificationService.getNotifications(userId);
      res.status(HttpStatus.OK).json(notifications);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  public isRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { notificationId } = req.body;
      const response = await this._notificationService.isRead(userId, notificationId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
