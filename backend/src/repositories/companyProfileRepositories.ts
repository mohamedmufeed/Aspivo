import Company from "../models/company";
import { BaseRepository } from "./baseRepository";

export class CompanyProfileRepositiories {
    async findCompanyById(companyId: string) {
        return await Company.findById(companyId)
    }
}