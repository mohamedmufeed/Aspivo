import { Request, Response } from "express";

export default interface IUserManagementController {
  getUsers(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
}
