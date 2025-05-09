import IJobService from "../../interface/service/company/jobInterface";
import { ICompany } from "../../models/company";
import { IJob, JobDocumnet } from "../../models/job";
import { IJobApplication } from "../../models/jobApplication";
import { CompanyRepostries } from "../../repositories/companyRepositories";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { sendNotification } from "../../server";
import { JobData } from "../../types/companyTypes";

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export class ComapnayJobService implements IJobService {
  constructor(private _companyRepositories: CompanyRepostries, private _notificationRepositories: NotificationRepository) { }

  async fetchCompany(userId: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepositories.findByUserId(userId);

    if (!company) {
      throw { status: 404, message: "Comapny not found" }
    }
    return { company, message: "comapany fetched sucsess fully" };
  }

  async postJob(data: JobData): Promise<{ job: JobDocumnet, message: string }> {
    if (!data) {
      throw { message: "Data not found" };
    }
  
    const { company } = data;
    const currentCompany = await this._companyRepositories.findById(company || "");
    
    if (!currentCompany) {
      throw { message: "Company not found" };
    }
  
    if (currentCompany.features.unlimitedJobPosting || currentCompany.jobLimit > 0) {
      const { job } = await this._companyRepositories.createJob(data);
      
      if (!job) {
        throw new Error("Job creation failed");
      }
      if (!currentCompany.features.unlimitedJobPosting && currentCompany.jobLimit > 0) {
        const companyId :string=String(currentCompany.id)
        await this._companyRepositories.decreaseJobLimit(companyId);
      }
  
      return { job: job.toObject(), message: "Job created successfully" };
    } else {
      throw { message: "Job posting limit reached" };
    }
  }
  

  async fetchJob(comapanyId: string) {
    const jobs = await this._companyRepositories.findAllJobs(comapanyId);
    if (!jobs) throw new Error("Jobs not found");
    return { jobs, message: "JOb fetched succsess fully" };
  }

  async editJob(jobId: string, data: JobData): Promise<{ job: IJob, message: string }> {
    const job = await this._companyRepositories.findJob(jobId);
    if (!job) throw new Error("JOb not found");
    job.jobTitle = data.jobTitle || job.jobTitle;
    job.category = data.category || job.category;
    job.typesOfEmployment = data.typesOfEmployment || job.typesOfEmployment;
    job.maximumSalary = data.maximumSalary || job.maximumSalary;
    job.minimumSalary = data.maximumSalary || job.minimumSalary;
    job.qualification = data.qualification || job.qualification;
    job.requiredSkills = data.requiredSkills || job.requiredSkills;
    job.jobResponsibilities =
      data.jobResponsibilities || job.jobResponsibilities;
    job.startDate = data.startDate || job.startDate;
    job.endDate = data.endDate || job.endDate;
    job.slot = data.slot || job.slot;
    job.requirements = data.requirements || job.requirements;
    job.jobDescription = data.jobDescription || job.jobDescription;

    await job.save();
    return { job, message: "Job edited sucsessfully" };
  }

  async chageJobStatus(jobId: string): Promise<{ job: IJob, message: string }> {
    if (!jobId) throw new Error("Job id nor found");
     const existingJob=await this._companyRepositories.findJob(jobId)
    if(!existingJob) throw new Error("existing job not found")
    const toggledStatus = !existingJob.isActive;
    const job = await this._companyRepositories.chageStatus(jobId,toggledStatus);
    if (!job) throw new Error("Somthing went wrong in job deleting");
    return { job, message: "job deletion sucsess fully" };
  }

  async getApplicantsForJob(jobId: string, companyId: string): Promise<{ applications: IJobApplication[], message: string }> {
    if (!companyId) throw { status: 404, message: "Company id is required" };
    const job = await this._companyRepositories.findJob(jobId);
    if (!job) throw { status: 404, message: "JOb not found" };
    if (job.company.toString() != companyId) {
      throw {
        status: 404,
        message: "You are not authorized to view applicants for this job",
      };
    }

    const applications = await this._companyRepositories.findApplications(jobId);
    return { applications, message: "Job application fetched sucsess" };
  }

  async getApplicantDetials(applicantId: string) {
    const applicant = await this._companyRepositories.findApplicationDetail(
      applicantId
    );

    if (!applicant) {
      throw new Error("Applicant detail not found");
    }
    return { applicant, message: "Applicant found" };
  }

  async updateStatus(applicantId: string, status: ApplicationStatus): Promise<{ application: IJobApplication, message: string }> {
    if (!applicantId) throw { status: 404, message: "Applicant ID required" };
    if (!status) throw { status: 404, message: "Status not found" };
    const application = await this._companyRepositories.findApplicationAndUpdate(applicantId, status);
    if (!application) throw { status: 404, message: "Application not found" };
    const job = await this._companyRepositories.findJob(application?.jobId.toString());
    const jobTitle = job?.jobTitle || "the job position";
    const message = status === "accepted"
      ? ` Your application for '${jobTitle}' was approved. The company will reach out soon.`
      : `Your application for '${jobTitle}' was ${status}. Thanks for applying!`;
    await this._notificationRepositories.createNotification(
      application.userId.toString(),
      message
    );
    sendNotification("user", application.userId.toString(), message);
    return { application, message: "Application updated successfully" };
  }
}
