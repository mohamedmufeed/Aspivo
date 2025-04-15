import Company from "../models/company.js";

export class CompanyProfileRepositiories{
    
async findCompanyById(companyId:string){
return await Company.findById(companyId)
}



}