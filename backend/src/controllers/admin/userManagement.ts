import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories";
import { AdminService } from "../../services/adminService/adminService";
import HttpStatus from "../../utils/httpStatusCode";
import IUserManagementController from "../../interface/controller/admin/userManagementInterface";
import { ERROR_MESSAGES } from "../../constants/error";

export class UserManagementController  implements IUserManagementController{
  constructor(
    private _adminService: AdminService,
    private adminRepostry: AdminRepostry
  ) {}

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.adminRepostry.getAllUsers();
      res.status(HttpStatus.OK).json({
        success: true,
        users,
        message: "User fetching successful",
      });
    } catch (error) {
      console.log("Error fetching users:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._adminService.blockUser(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        response,
        message: "User status changed successfully",
      });
    } catch (error) {
      console.log("Error blocking user:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}
