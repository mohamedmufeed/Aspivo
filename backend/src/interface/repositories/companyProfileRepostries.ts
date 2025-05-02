import {  ICompany } from "../../models/company";

export interface ICompanyProfileRepositories{
    findCompanyById(companyId:string):Promise<ICompany|null>
}