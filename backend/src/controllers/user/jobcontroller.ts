import { query, Request, Response } from "express";
import { JobService } from "../../services/jobService.js";
const jobService = new JobService();
export const fetchJob = async (req: Request, res: Response) => {
  try {
    const rawPage = req.query.page as string | undefined;
    const rawLimit = req.query.limit as string | undefined;

    const page = rawPage && !isNaN(parseInt(rawPage)) ? parseInt(rawPage) : 1;
    const limit =
      rawLimit && !isNaN(parseInt(rawLimit)) ? parseInt(rawLimit) : 5;

    const response = await jobService.fetchJob(page, limit);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error in fetch job", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobDetails = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const response = await jobService.getJobDetails(jobId);
    res.status(200).json(response);
  } catch (error) {
    console.log("Erorr in geting job details", error);
    res.status(500).json({ message: "Internal server eror" });
  }
};


export const applyForJob=async(req:Request,res:Response)=>{
  try {
    const jobId=req.params.id
    const {userId}=req.body
    const response=await jobService.applyForJOb(jobId,userId)
    res.status(200).json(response)
    
  } catch (error) {
    console.log("Eroro in apllying job",error)
    res.status(500).json({message:"Internal error"})
  }
}