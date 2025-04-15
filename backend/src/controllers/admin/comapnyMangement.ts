import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/adminService/adminService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import IComapnyManagement from "../../interface/controller/admin/companyManagemntInterface.js";

export class AdminController implements IComapnyManagement{
  constructor(private adminService: AdminService) {}

  getCompanies = async (req: Request, res: Response) => {
    try {
      const companies = await this.adminService.getAllCompanies();
      res.status(HttpStatus.OK).json({ companies, message: "Fetch company successful" });
    } catch (error) {
      console.log("Error from fetching all companies", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  handleCompanyRequest = async (req: Request, res: Response) => {
    try {
      const { comapnyId, action } = req.body;
      const company = await this.adminService.handleCompanyRequest(
        comapnyId,
        action
      );
      res.status(HttpStatus.OK).json(company);
    } catch (error) {
      console.log("Error in handling request", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  };

  approvedCompanies = async (req: Request, res: Response) => {
    try {
      const response = await this.adminService.approvedCompany();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error in fetching approved companies", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  };
}
