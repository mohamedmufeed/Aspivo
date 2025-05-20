
import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";
import {  GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetUsersDtoResponse, GetUsersResponse } from "../../../types/userTypes";

export default interface IAdminService {
  getAllCompanies(query:GetPaginationQuery):Promise<GetCompanyResponse>
  getAllUsers(query:GetPaginationQuery):Promise<GetUsersDtoResponse>
  blockUser(id: string):Promise<UserServiceResponse>;
  handleCompanyRequest(companyId: string, action: string):Promise<CompanySerivceResponse> ;
  approvedCompany(query:GetPaginationQuery):Promise<GetApprovedCompanyResponse> ;
}
