import { Request, Response } from "express";
import { ComapnayJobService } from "../../services/compnyService/comapnyJobService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import ICompanyJobController from "../../interface/controller/company/companyJobInterface.js";

export class CompanyJobController implements ICompanyJobController {
  constructor(private companyJobService: ComapnayJobService) { }

  fetchCompany = async (req: Request, res: Response) => {
    try {
      const userId = req.query.id;
      if (!userId || typeof userId !== 'string') {
         res.status(HttpStatus.BAD_REQUEST).json({ 
          message: "Company ID is required and must be a string" 
        });
        return
      }
      const company = await this.companyJobService.fetchCompany(userId);
      res.status(HttpStatus.OK).json({ company });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  postJob = async (req: Request, res: Response) => {
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

      const response = await this.companyJobService.postJob(data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error posting job", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  fetchJob = async (req: Request, res: Response) => {
    try {
      const comapanyId = req.params.id;
      const response = await this.companyJobService.fetchJob(comapanyId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  editJob = async (req: Request, res: Response) => {
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

      const response = await this.companyJobService.editJob(jobId, data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  deleteJob = async (req: Request, res: Response) => {
    try {
      const jobId = req.params.id;
      const response = await this.companyJobService.deleteJob(jobId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  getApplicantsForJob = async (req: Request, res: Response) => {
    try {
      const jobId = req.params.id;
      const { companyId } = req.query;

      if (typeof companyId === "string") {
        const response = await this.companyJobService.getApplicantsForJob(jobId, companyId);
        res.status(HttpStatus.OK).json(response);
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid companyId" });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  getApplicantDetails = async (req: Request, res: Response) => {
    try {
      const applicantId = req.params.id;
      const response = await this.companyJobService.getApplicantDetials(applicantId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error fetching applicant details", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const applicantId = req.params.id;
      const { status } = req.body;
      const response = await this.companyJobService.updateStatus(applicantId, status);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };
}
