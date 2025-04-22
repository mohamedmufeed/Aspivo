import { Request, Response } from "express";
import { AdminService } from "../../services/adminService/adminService";
import HttpStatus from "../../utils/httpStatusCode";
import IComapnyManagement from "../../interface/controller/admin/companyManagemntInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import { GetPaginationQuery } from "../../types/userTypes";
export class AdminController implements IComapnyManagement {
  constructor(private _adminService: AdminService) { }

  getCompanies = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, q = "" } = req.query
      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(q)
      }
      const result = await this._adminService.getAllCompanies(query);
      res.status(HttpStatus.OK).json({
        sucsess: true,
        companies: result.companies,
        totalRequest: result.totalRequest,
        totalPages: result.totalPages,
        message: "Fetch company successful"
      });
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
      const { page = 1, limit = 10, q = "" } = req.query
      const query = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(q)
      }
      const response = await this._adminService.approvedCompany(query);
      res.status(HttpStatus.OK).json({
        sucssess: true,
        company: response.company,
        totalCompany: response.totalCompany,
        totalPages: response.totalPages,
        message: "Fetch approved company sucsessful"
      });
    } catch (error) {
      console.log("Error in fetching approved companies", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
