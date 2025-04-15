import { Request, Response } from "express";

export interface IJobController {
  fetchJob(req: Request, res: Response): Promise<void>;
  getJobDetails(req: Request, res: Response): Promise<void>;
  applyForJob(req: Request, res: Response): Promise<void>;
  appliedJobs(req: Request, res: Response): Promise<void>;
  isApplied(req: Request, res: Response): Promise<void>;
}
