import { CompanyRepostries } from "../../repositories/companyRepositories.js";

const companyRepositories = new CompanyRepostries();

export class ComapnayProfileService{
    async fetchCompany(userId:string){
        const company= await companyRepositories.findById(userId)
        return {company,message:"comapany fetched sucsess fully"}
    }
}