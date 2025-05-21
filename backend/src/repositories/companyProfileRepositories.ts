import { ICompanyProfileRepositories } from "../interface/repositories/companyProfileRepostries";
import Company from "../models/company";
export class CompanyProfileRepositiories implements ICompanyProfileRepositories {
    async findCompanyById(companyId: string) {
        return await Company.findById(companyId,{isBlocked:false})
    }
}