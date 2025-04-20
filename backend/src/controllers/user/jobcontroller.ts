import { Request, Response } from "express";
import { JobService } from "../../services/jobService";
import HttpStatus from "../../utils/httpStatusCode";
import { IJobController } from "../../interface/controller/user/jobControlerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import { error } from "console";

export class JobController implements IJobController {
  private _jobService: JobService;
  constructor(jobService: JobService) {
    this._jobService = jobService;
  }

   fetchJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawPage = req.query.page as string | undefined;
      const rawLimit = req.query.limit as string | undefined;

      const page = rawPage && !isNaN(parseInt(rawPage)) ? parseInt(rawPage) : 1;
      const limit = rawLimit && !isNaN(parseInt(rawLimit)) ? parseInt(rawLimit) : 5;

      const response = await this._jobService.fetchJob(page, limit);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

   getJobDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.id;
      const userId = req.query.userId as string;
      const response = await this._jobService.getJobDetails(jobId, userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err=error as Error
      console.log("the error",err.message)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message});
    }
  };

   applyForJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.id;
      const { userId } = req.body;
      const response = await this._jobService.applyForJOb(jobId, userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

   appliedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._jobService.appliedjobs(userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
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

      const response = await this._jobService.isApplied(userId, jobId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
