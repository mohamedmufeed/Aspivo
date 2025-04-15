import { Request, Response } from "express";

export default interface ISubscriptionController {
  getSubscriptions(req: Request, res: Response): Promise<void>;
  updateSubscriptionStatus(req: Request, res: Response): Promise<void>;
}
