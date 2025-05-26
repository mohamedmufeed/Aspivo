import { IJob } from "../../models/job";
import {  IJobApplicationDto } from "../../types/companyTypes";

export const mappedJobsDto = (job: IJob) => {
    return {
        _id: job._id.toString(),
        jobTitle: job.jobTitle,
        isActive: job.isActive ?? true,
        startDate: job.startDate,
        maximumSalary:job.maximumSalary,
        minimumSalary:job.minimumSalary,
        category:job.category,
        slot:job.slot,
        requiredSkills:job.requiredSkills,
        jobDescription:job.jobDescription,
        jobResponsibilities:job.jobResponsibilities,
        qualification:job.qualification,
        requirements:job.requirements,
        endDate: job.endDate,
        typesOfEmployment: job.typesOfEmployment,
    }
}

export const jobStatusDto = (job: IJob) => {
    return {
        _id: job._id.toString(),
        isActive: job.isActive
    }
}


export const mappedJobApplication = (application: IJobApplicationDto) => {
    return {
        _id: application._id,
        status: application.status,
        appliedAt: application.appliedAt,
        user: {
            profileImage: application.user.profileImage,
            firstName: application.user.firstName,
            lastName: application.user.lastName
        },
        job: {
            jobTitle: application.job.jobTitle
        }

    }
}



export const jobApplicationDto = (application: any) => {
    return {
        _id: application._id.toString(),
        appliedAt: application.appliedAt,
        status: application.status,
        jobId: {
            jobTitle: application.jobId.jobTitle,
            typesOfEmployment: application.jobId.typesOfEmployment,
            company: application.jobId.company.toString()
        },
        userId:{
            _id:application.userId._id.toString(),
            email:application.userId.email,
            profileImage:application.userId.profileImage,
            experiences:application.userId.experiences,
            firstName:application.userId.firstName,
            lastName:application.userId.lastName,
            education:application.userId.education,
            phoneNumber:application.userId.phoneNumber,
            resume:application.userId.resume,
            skills:application.userId.skills
        }
    }
}