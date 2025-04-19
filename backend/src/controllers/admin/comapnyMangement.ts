import { Request, Response } from "express";
import { AdminService } from "../../services/adminService/adminService";
import HttpStatus from "../../utils/httpStatusCode";
import IComapnyManagement from "../../interface/controller/admin/companyManagemntInterface";
import { ERROR_MESSAGES } from "../../constants/error";
export class AdminController implements IComapnyManagement{
  constructor(private _adminService: AdminService) {}

  getCompanies = async (req: Request, res: Response) => {
    try {
      const companies = await this._adminService.getAllCompanies();
      res.status(HttpStatus.OK).json({ companies, message: "Fetch company successful" });
    } catch (error) {
      console.log("Error from fetching all companies", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  handleCompanyRequest = async (req: Request, res: Response) => {
    try {
      const { comapnyId, action } = req.body;
      const company = await this._adminService.handleCompanyRequest(
        comapnyId,
        action
      );
      res.status(HttpStatus.OK).json(company);
    } catch (error) {
      console.log("Error in handling request", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  approvedCompanies = async (req: Request, res: Response) => {
    try {
      const response = await this._adminService.approvedCompany();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error in fetching approved companies", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
