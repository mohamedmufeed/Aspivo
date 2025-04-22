import { ICompanyProfileRepositories } from "../interface/repositories/companyProfileRepostries";
import Company, { CompanyDocument } from "../models/company";
import { BaseRepository } from "./baseRepository";

export class CompanyProfileRepositiories implements ICompanyProfileRepositories {
    async findCompanyById(companyId: string) {
        return await Company.findById(companyId)
    }
}