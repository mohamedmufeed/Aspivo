import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/adminService/adminService.js";
const adminService = new AdminService();
const adminRepostry = new AdminRepostry();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await adminRepostry.getAllUsers();
    res
      .status(200)
      .json({ success: true, users, message: "user fetchig sucsess" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const response = await adminService.blockUser(userId);
    res
      .status(200)
      .json({
        success: true,
        response,
        message: "User status changes sucsess fulyl",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
