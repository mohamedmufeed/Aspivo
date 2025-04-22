import { ICompany } from "../../../models/company";
import { IUser } from "../../../models/user";
import { Company } from "../../../types/companyTypes";
import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";
import {  GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetUsersResponse } from "../../../types/userTypes";

export default interface IAdminService {
  getAllCompanies(query:GetPaginationQuery):Promise<GetCompanyResponse>
  getAllUsers(query:GetPaginationQuery):Promise<GetUsersResponse>
  blockUser(id: string):Promise<UserServiceResponse>;
  handleCompanyRequest(companyId: string, action: string):Promise<CompanySerivceResponse> ;
  approvedCompany(query:GetPaginationQuery):Promise<GetApprovedCompanyResponse> ;
}
