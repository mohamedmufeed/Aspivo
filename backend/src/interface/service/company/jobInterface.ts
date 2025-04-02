import { JobData } from "../../../types/companyTypes";
import { CompanySerivceResponse, JobApplicationResponse, JobServiceResponse } from "../../../types/interfaceTypes";
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export default interface IJobService{
    fetchCompany(userId:string):CompanySerivceResponse;
    postJob(data:JobData):JobServiceResponse;
    editJob(jobId:string,data:JobData):JobServiceResponse;
    deleteJob(jobId:string):JobServiceResponse;
    getApplicantsForJob(jobid:string,comapanyId:string):JobApplicationResponse;
   getApplicantDetials(applicantId: string) :any;
   updateStatus(applicantId:string,status:ApplicationStatus):JobApplicationResponse

}