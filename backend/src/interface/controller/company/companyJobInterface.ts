import { Request, Response } from "express";

export default interface ICompanyJobController {
  fetchCompany(req: Request, res: Response): Promise<void>;
  postJob(req: Request, res: Response): Promise<void>;
  fetchJob(req: Request, res: Response): Promise<void>;
  editJob(req: Request, res: Response): Promise<void>;
  chageJobStatus(req: Request, res: Response): Promise<void>;
  getApplicantsForJob(req: Request, res: Response): Promise<void>;
  getApplicantDetails(req: Request, res: Response): Promise<void>;
  updateStatus(req: Request, res: Response): Promise<void>;
  getJobDetails(req:Request,res:Response):Promise<void>
}
