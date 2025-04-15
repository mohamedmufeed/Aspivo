import { Contact, IComapny, TeamMember } from "../../../types/companyTypes";
import { CompanySerivceResponse } from "../../../types/interfaceTypes";

export default interface IProfileService{
    getProfile(companyId:string):CompanySerivceResponse
    editCompanyProfile(comapnyId:string,data:IComapny):CompanySerivceResponse
    editCompanyDescription(comapnyId:string,data:string):CompanySerivceResponse
    addTechStack(comapnyId:string,stack:string[]):CompanySerivceResponse
    editTeam(comapnyId:string,members:TeamMember[]):CompanySerivceResponse
    editContact(companyId:string,contact:Contact[]):CompanySerivceResponse
}