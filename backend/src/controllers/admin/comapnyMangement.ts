import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import IComapnyManagement from "../../interface/controller/admin/companyManagemntInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import { GetPaginationQuery } from "../../types/userTypes";
import IAdminService from "../../interface/service/admin/adminInterface";
export class AdminController implements IComapnyManagement {
  constructor(private _adminService: IAdminService) { }

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
      const err = error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message });
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
      const err = error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message });
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
      const err = error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message });
    }
  };


  handleCompanyBlock = async (req: Request, res: Response) => {
    try {
      const comapnyId = req.params.id
      const response = await this._adminService.handleCompanyBlockStatus(comapnyId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR })
    }
  }
}
