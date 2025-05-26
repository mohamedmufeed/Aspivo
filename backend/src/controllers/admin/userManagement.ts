import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import IUserManagementController from "../../interface/controller/admin/userManagementInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import { GetPaginationQuery } from "../../types/userTypes";
import IAdminService from "../../interface/service/admin/adminInterface";

export class UserManagementController  implements IUserManagementController{
  constructor(private _adminService: IAdminService,) {}

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, q = "" } = req.query;
  
      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(q),
      };
  
      const result = await this._adminService.getAllUsers(query);
      res.status(200).json({
        success: true,
        users: result.users,
        totalUsers: result.totalUsers,
        totalPages: result.totalPages,
        message: "User fetching successful",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:ERROR_MESSAGES.SERVER_ERROR,
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}
