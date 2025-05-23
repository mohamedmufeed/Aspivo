import { ICompany } from "../../models/company";
import { IJob, JobDocumnet } from "../../models/job";
import { IUser } from "../../models/user";
import { IJobDto } from "../../types/userTypes";




export const mappedHomeJobsDto = (job: JobDocumnet): IJobDto => {
  const company = job.company as unknown as ICompany;

  return {
    _id: job._id.toString(),
    jobTitle: job.jobTitle,
    maximumSalary: job.maximumSalary,
    minimumSalary: job.minimumSalary,
    isActive: job.isActive ?? true,
    company: {
      _id: company._id.toString(),
      companyName: company.companyName,
      logo: company.logo,
      location: company.location
    }
  };
};


export const userProfileDto = (user: IUser) => {
  return {
    _id: user._id.toString(),
    email: user.email,
    skills: user.skills,
    profileImage: user.profileImage,
    resume: user.resume,
    experiences: user.experiences,
    education: user.education,
    subscription:user.subscription,
    features:user.features,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    phoneNumber: user.phoneNumber,
    position: user.position,
    about: user.about
  }
}