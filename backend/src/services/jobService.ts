import { JobRepositories } from "../repositories/jobRepositories.js";

const jobrepositories = new JobRepositories();
export class JobService {
  async fetchJob(page:number,limit:number) {
    const job = await jobrepositories.fetchJob(page,limit);
    if(!job||job.length===0) throw  new Error("Job not found")
        return {job,message:"Job fetched sucsess fully"}
  }
}
