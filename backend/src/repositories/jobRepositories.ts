import Job from "../models/job.js"
export class JobRepositories{
    async fetchJob(page:number,limit:number){
        const skip=(page-1)*limit
        return await Job.find().populate("company", "companyName logo location").skip(skip).limit(limit);
    }
}