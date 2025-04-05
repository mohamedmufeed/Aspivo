import { query, Request, Response } from "express";
import { JobService } from "../../services/jobService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
const jobService = new JobService();
export const fetchJob = async (req: Request, res: Response) => {
  try {
    const rawPage = req.query.page as string | undefined;
    const rawLimit = req.query.limit as string | undefined;

    const page = rawPage && !isNaN(parseInt(rawPage)) ? parseInt(rawPage) : 1;
    const limit =
      rawLimit && !isNaN(parseInt(rawLimit)) ? parseInt(rawLimit) : 5;

    const response = await jobService.fetchJob(page, limit);
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const getJobDetails = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const userId = req.query.userId as string;
    const response = await jobService.getJobDetails(jobId,userId);
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server eror" });
  }
};


export const applyForJob=async(req:Request,res:Response)=>{
  try {
    const jobId=req.params.id
    const {userId}=req.body
    const response=await jobService.applyForJOb(jobId,userId)
    res.status(200).json(response)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal error"})
  }
}

export const appliedjobs=async(req:Request,res:Response)=>{
  try {
    const userId= req.params.id
    const response= await jobService.appliedjobs(userId)
    res.status(200).json(response)

  } catch (error) {
    res.status(500).json({message:"Internal server Error"})
  }
}


export const isApplied=async(req:Request,res:Response)=>{
  try {
    const userId=req.params.id
    const jobId = req.query.jobId as string;
    if(!userId|| !jobId){
      res.status(HttpStatus.BAD_REQUEST).json({message:"User id or job id is required"})
    }
    const response=await jobService.isApplied(userId,jobId)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
  }
}