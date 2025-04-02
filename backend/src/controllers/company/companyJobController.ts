import { Request, response, Response } from "express";
import { ComapnayJobService } from "../../services/compnyService/comapnyJobService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
const comapanyJobService = new ComapnayJobService();

export const fetchCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const company = await comapanyJobService.fetchCompany(userId);
    res.status(HttpStatus.OK).json({ company });
  } catch (error) {
    console.log("error in fetching company", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const postJob = async (req: Request, res: Response) => {
  try {
    const company = req.params.id;
    const {
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
    } = req.body;
    const data = {
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
      company,
    };
    const respone = await comapanyJobService.postJob(data);
    res.status(HttpStatus.OK).json(respone);
  } catch (error) {
    console.log("Error in the job creating ", error);
    res.status(
      HttpStatus.INTERNAL_SERVER_ERROR
    ).json({ message: "Internal server error" });
  }
};

export const fetchJob = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  try {
    const respone = await comapanyJobService.fetchJob(companyId);
    res.status(HttpStatus.OK).json(respone);
  } catch (error) {
    console.log("Error fetching the jobs", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const editJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const {
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
    } = req.body;

    const data = {
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
    };
    const respone = await comapanyJobService.editJob(jobId, data);
    res.status(HttpStatus.OK).json(respone);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const respone = await comapanyJobService.deleteJob(jobId);
    res.status(HttpStatus.OK).json(respone);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const getApplicantsForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { companyId } = req.query;
    if (typeof companyId == "string") {
      const response = await comapanyJobService.getApplicantsForJob(
        jobId,
        companyId
      );
      res.status(HttpStatus.OK).json(response);
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const getApplicantDetials = async (req: Request, res: Response) => {
  try {
    const applicantId = req.params.id;

    const respone = await comapanyJobService.getApplicantDetials(
      applicantId
    );

    res.status(HttpStatus.OK).json(respone);
  } catch (error) {
    console.log("Error on fetching applicant details", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server Error" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const applicantId = req.params.id;
    const {status}=req.body
    const response= await comapanyJobService.updateStatus(applicantId,status)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
  }
};
