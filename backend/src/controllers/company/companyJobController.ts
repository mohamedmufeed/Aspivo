import { Request, Response } from "express";
import { ComapnayProfileService } from "../../services/compnyService/comapnyProfileService.js";
const comapanyProfileService = new ComapnayProfileService();

export const fetchCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const company = await comapanyProfileService.fetchCompany(userId);
    res.status(200).json({ company });
  } catch (error) {
    console.log("error in fetching company", error);
    res.status(500).json({ message: "Internal server error" });
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
    const respone = await comapanyProfileService.postJob(data);
    res.status(200).json(respone);
  } catch (error) {
    console.log("Error in the job creating ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchJob = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  try {
    const respone = await comapanyProfileService.fetchJob(companyId);
    res.status(200).json(respone);
  } catch (error) {
    console.log("Error fetching the jobs", error);
    res.status(500).json({ message: "Internal server error" });
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
    const respone = await comapanyProfileService.editJob(jobId, data);
    res.status(200).json(respone);
  } catch (error) {
    console.log("Error editng job", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const respone = await comapanyProfileService.deleteJob(jobId);
    res.status(200).json(respone);
  } catch (error) {
    console.log("Error on deleting error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicantsForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { companyId } = req.query;
    if (typeof companyId == "string") {
      const response = await comapanyProfileService.getApplicantsForJob(
        jobId,
        companyId
      );
      res.status(200).json(response);
    }
  } catch (error) {
    console.log("Error in the fetchhing job applicants :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
