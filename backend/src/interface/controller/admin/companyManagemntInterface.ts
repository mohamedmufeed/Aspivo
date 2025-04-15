import { Request, Response } from "express";

export default interface IComapnyManagement {
  getCompanies(req: Request, res: Response): Promise<void>;
  handleCompanyRequest(req: Request, res: Response): Promise<void>;
  approvedCompanies(req: Request, res: Response): Promise<void>;
}
