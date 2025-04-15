import { Request, Response } from "express";
import { JobService } from "../../services/jobService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import { IJobController } from "../../interface/controller/user/jobControlerInterface.js";

export class JobController implements IJobController {
  private jobService: JobService;
  constructor(jobService: JobService) {
    this.jobService = jobService;
  }

   fetchJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawPage = req.query.page as string | undefined;
      const rawLimit = req.query.limit as string | undefined;

      const page = rawPage && !isNaN(parseInt(rawPage)) ? parseInt(rawPage) : 1;
      const limit = rawLimit && !isNaN(parseInt(rawLimit)) ? parseInt(rawLimit) : 5;

      const response = await this.jobService.fetchJob(page, limit);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

   getJobDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.id;
      const userId = req.query.userId as string;
      const response = await this.jobService.getJobDetails(jobId, userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

   applyForJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.id;
      const { userId } = req.body;
      const response = await this.jobService.applyForJOb(jobId, userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

   appliedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this.jobService.appliedjobs(userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

   isApplied = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const jobId = req.query.jobId as string;

      if (!userId || !jobId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "User id or job id is required" });
        return;
      }

      const response = await this.jobService.isApplied(userId, jobId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };
}
