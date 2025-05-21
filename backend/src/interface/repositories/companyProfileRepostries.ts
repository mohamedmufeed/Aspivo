import {  CompanyDocument, ICompany } from "../../models/company";

export interface ICompanyProfileRepositories{
    findCompanyById(companyId:string):Promise<CompanyDocument|null>
}