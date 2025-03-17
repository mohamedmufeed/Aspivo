import { CompanyRepostries } from "../../repositories/companyRepositories.js";

const companyRepositories = new CompanyRepostries();

export class ComapnayProfileService{
    async fetchCompany(userId:string){
        const company= await companyRepositories.findByUserId(userId)
        return {company,message:"comapany fetched sucsess fully"}
    }
}