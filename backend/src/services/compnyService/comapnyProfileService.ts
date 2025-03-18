import { CompanyRepostries } from "../../repositories/companyRepositories.js";
import { JobData } from "../../types/companyTypes.js";

const companyRepositories = new CompanyRepostries();

export class ComapnayProfileService {
  async fetchCompany(userId: string) {
    const company = await companyRepositories.findByUserId(userId);
    return { company, message: "comapany fetched sucsess fully" };
  }

  async postJob(data: JobData) {
    if(!data){
        throw {message:"data not found"}
    }
    const response = await companyRepositories.createJob(data);

    return {response, message:"job created sucsess fully"};
  }
}
