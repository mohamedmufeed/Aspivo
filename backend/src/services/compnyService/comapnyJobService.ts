import { APPLICANT_ID_REQUIRED, APPLICATION_NOT_FOUND, APPLICATION_UPDATED_SUCCESSFULLY, COMPANY_FETCHED_SUCCESSFULLY, COMPANY_ID_REQUIRED, COMPANY_NOT_FOUND, DATA_NOT_FOUND, EXISTING_JOB_NOT_FOUND, JOB_CREATED_SUCCESSFULLY, JOB_CREATION_FAILED, JOB_DELETED_SUCCESSFULLY, JOB_EDITED_SUCCESSFULLY, JOB_ID_NOT_FOUND, JOB_NOT_FOUND, JOB_POSTING_LIMIT_REACHED, STATUS_NOT_FOUND, UNAUTHORIZED_TO_VIEW_APPLICANTS } from "../../constants/message";
import { INotificationRepository } from "../../interface/repositories/NotifictatonRepository";
import IJobServiceInterface from "../../interface/service/company/jobInterface";
import { ICompany } from "../../models/company";
import { IJob, JobDocumnet } from "../../models/job";
import { IJobApplication } from "../../models/jobApplication";
import { CompanyRepostries } from "../../repositories/companyRepositories";
import { sendNotification } from "../../server";
import { IJobApplicationDto, JobData } from "../../types/companyTypes";
import { GetPaginationQuery } from "../../types/userTypes";
import { jobApplicationDto, jobStatusDto, mappedJobApplication, mappedJobsDto } from "../../utils/dto/companyDto";

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export class ComapnayJobService implements IJobServiceInterface {
  constructor(private _companyRepositories: CompanyRepostries, private _notificationRepositories: INotificationRepository) { }

  async fetchCompany(userId: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepositories.findByUserId(userId);

    if (!company) {
      throw { status: 404, message: COMPANY_NOT_FOUND}
    }
    return { company, message: COMPANY_FETCHED_SUCCESSFULLY };
  }

  async postJob(data: JobData): Promise<{ job: JobDocumnet, message: string }> {
    if (!data) {
      throw { message: DATA_NOT_FOUND };
    }

    const { company } = data;
    const currentCompany = await this._companyRepositories.findById(company || "");

    if (!currentCompany) {
      throw { message: COMPANY_NOT_FOUND };
    }

    if (currentCompany.features.unlimitedJobPosting || currentCompany.jobLimit > 0) {
      const { job } = await this._companyRepositories.createJob(data);

      if (!job) {
        throw new Error(JOB_CREATION_FAILED);
      }
      if (!currentCompany.features.unlimitedJobPosting && currentCompany.jobLimit > 0) {
        const companyId: string = String(currentCompany.id)
        await this._companyRepositories.decreaseJobLimit(companyId);
      }

      return { job: job.toObject(), message: JOB_CREATED_SUCCESSFULLY };
    } else {
      throw { message: JOB_POSTING_LIMIT_REACHED };
    }
  }


  async fetchJob(comapanyId: string, query: GetPaginationQuery) {
    const response = await this._companyRepositories.findAllJobs(comapanyId, query);
    if (!response) throw new Error(JOB_NOT_FOUND);
    const mappedResponse = {
      jobs: response.jobs.map((job) => mappedJobsDto(job)),
      totalJobs: response.totalJobs,
      totalPages: response.totalPages

    }
    return mappedResponse;
  }

  async editJob(jobId: string, data: JobData): Promise<{ job: IJob, message: string }> {
    const job = await this._companyRepositories.findJob(jobId);
    if (!job) throw new Error(JOB_NOT_FOUND);
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
    return { job, message: JOB_EDITED_SUCCESSFULLY };
  }

  async chageJobStatus(jobId: string) {
    if (!jobId) throw new Error(JOB_ID_NOT_FOUND);
    const existingJob = await this._companyRepositories.findJob(jobId)
    if (!existingJob) throw new Error(EXISTING_JOB_NOT_FOUND)
    const toggledStatus = !existingJob.isActive;
    const job = await this._companyRepositories.chageStatus(jobId, toggledStatus);
    if (!job) throw new Error(JOB_NOT_FOUND);
    const jobDto = jobStatusDto(job)
    return { job: jobDto, message: JOB_DELETED_SUCCESSFULLY };
  }

  async getApplicantsForJob(jobId: string, companyId: string, query: GetPaginationQuery) {
    if (!companyId) throw { status: 404, message: COMPANY_ID_REQUIRED };
    const job = await this._companyRepositories.findJob(jobId);
    if (!job) throw { status: 404, message: JOB_NOT_FOUND };
    if (job.company.toString() != companyId) {
      throw {
        status: 404,
        message: UNAUTHORIZED_TO_VIEW_APPLICANTS,
      };
    }
    const response = await this._companyRepositories.findApplications(jobId, query);
    const mappedResponse = {
      applications: response.applications.map((application:IJobApplicationDto) => mappedJobApplication(application)),
      totalApplications: response.totalApplications,
      totalPages: response.totalPages
    }
    return mappedResponse
  }

  async getApplicantDetials(applicantId: string) {
    const applicant = await this._companyRepositories.findApplicationDetail(
      applicantId
    );

    if (!applicant) {
      throw new Error(APPLICATION_NOT_FOUND);
    }
     const applicantDto=jobApplicationDto(applicant)
    return { applicant:applicantDto, message:APPLICATION_NOT_FOUND };
  }

  async updateStatus(applicantId: string, status: ApplicationStatus): Promise<{ application: IJobApplication, message: string }> {
    if (!applicantId) throw { status: 404, message: APPLICANT_ID_REQUIRED };
    if (!status) throw { status: 404, message: STATUS_NOT_FOUND };
    const application = await this._companyRepositories.findApplicationAndUpdate(applicantId, status);
    if (!application) throw { status: 404, message: APPLICATION_NOT_FOUND };
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
    return { application, message: APPLICATION_UPDATED_SUCCESSFULLY };
  }
}
