
import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";
import {  GetApprovedCompanyDtoResponse, GetCompanyDtoResponse, GetPaginationQuery, GetUsersDtoResponse } from "../../../types/userTypes";

export default interface IAdminService {
  getAllCompanies(query:GetPaginationQuery):Promise<GetCompanyDtoResponse>
  getAllUsers(query:GetPaginationQuery):Promise<GetUsersDtoResponse>
  blockUser(id: string):Promise<UserServiceResponse>;
  handleCompanyRequest(companyId: string, action: string):Promise<CompanySerivceResponse> ;
  approvedCompany(query:GetPaginationQuery):Promise<GetApprovedCompanyDtoResponse> ;
  handleCompanyBlockStatus(comapnyId:string):Promise<CompanySerivceResponse>
}
