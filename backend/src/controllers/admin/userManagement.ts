import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/adminService/adminService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import IUserManagementController from "../../interface/controller/admin/userManagementInterface.js";

export class UserManagementController  implements IUserManagementController{
  constructor(
    private adminService: AdminService,
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
        message: "Internal server error",
      });
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this.adminService.blockUser(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        response,
        message: "User status changed successfully",
      });
    } catch (error) {
      console.log("Error blocking user:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
