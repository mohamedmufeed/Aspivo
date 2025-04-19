import { CompanyRepostries } from "../../repositories/companyRepositories";
import { sendNotification } from "../../server";
import { JobData } from "../../types/companyTypes";
import { NotificationService } from "../notificationService";

const notificationService = new NotificationService();
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export class ComapnayJobService {
  constructor(private _companyRepositories: CompanyRepostries) {}
  async fetchCompany(userId: string) {
    const company = await this._companyRepositories.findByUserId(userId);
    return { company, message: "comapany fetched sucsess fully" };
  }

  async postJob(data: JobData) {
    if (!data) {
      throw { message: "data not found" };
    }
    const response = await this._companyRepositories.createJob(data);

    return { response, message: "job created sucsess fully" };
  }

  async fetchJob(comapanyId: string) {
    const jobs = await this._companyRepositories.findJobs(comapanyId);
    if (!jobs) throw new Error("Jobs not found");
    return { jobs, message: "JOb fetched succsess fully" };
  }

  async editJob(jobId: string, data: JobData) {
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

  async deleteJob(jobId: string) {
    if (!jobId) throw new Error("Job id nor found");
    const job = await this._companyRepositories.deleteJob(jobId);
    if (!job) throw new Error("Somthing went wrong in job deleting");
    return { job, message: "job deletion sucsess fully" };
  }

  async getApplicantsForJob(jobId: string, companyId: string) {
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
    // console.log("the applic", applications);
    // if (applications && applications.length > 0) {
    //   for (const application of applications) {
    //     const user = application.userId;

    //     if (!user?.firstName || !user?.lastName || !user?.profileImage) {
    //       throw {
    //         status: 400,
    //         message: `Applicant ${user?.firstName || "Unknown"} ${
    //           user?.lastName || "Unknown"
    //         } needs to update their profile`,
    //       };
    //     }
    //   }
    // }
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

  async updateStatus(applicantId: string, status: ApplicationStatus) {
    if (!applicantId) throw { status: 404, message: "Applicant ID required" };
    if (!status) throw { status: 404, message: "Status not found" };
    const application = await this._companyRepositories.findApplicationAndUpdate(applicantId,status);
    if (!application) throw { status: 404, message: "Application not found" };
    const job = await this._companyRepositories.findJob(application?.jobId.toString());
    const jobTitle = job?.jobTitle || "the job position";
    const message = status === "accepted"
    ? `🎉 Your application for '${jobTitle}' was approved. The company will reach out soon.`
    : `Your application for '${jobTitle}' was ${status}. Thanks for applying!`;
  
   
    await notificationService.createNotification(
      application.userId.toString(),
      message
    );
    sendNotification("user", application.userId.toString(), message);
    return { application, message: "Application updated successfully" };
  }
}
