import { query, Request, Response } from "express";
import { JobService } from "../../services/jobService.js";
const jobService = new JobService();
export const fetchJob = async (req: Request, res: Response) => {
  try {
    const rawPage = req.query.page as string | undefined;
    const rawLimit = req.query.limit as string | undefined;

    const page = rawPage && !isNaN(parseInt(rawPage)) ? parseInt(rawPage) : 1;
    const limit = rawLimit && !isNaN(parseInt(rawLimit)) ? parseInt(rawLimit) : 5;

    const response = await jobService.fetchJob(page,limit);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error in fetch job",error)
    res.status(500).json({ message: "Internal server error" });
  }
};
