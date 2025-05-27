
import { Contact, TeamMember, IComapny } from "../../../types/companyTypes";
import { CompanySerivceResponse } from "../../../types/interfaceTypes";

export default interface IProfileService{
    getProfile(companyId:string):Promise<CompanySerivceResponse>
    editCompanyProfile(comapnyId:string,data:IComapny):Promise<CompanySerivceResponse>
    editCompanyDescription(comapnyId:string,data:string):Promise<CompanySerivceResponse>
    addTechStack(comapnyId:string,stack:string[]):Promise<CompanySerivceResponse>
    editTeam(comapnyId:string,members:TeamMember[]):Promise<CompanySerivceResponse>
    editContact(companyId:string, body: { contact: Contact[]; }):Promise<CompanySerivceResponse>
}