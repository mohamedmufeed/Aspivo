
import { IcomapnyBlock, IComapnyRequest } from "../../../types/companyTypes";
import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";
import {  GetApprovedCompanyDtoResponse, GetCompanyDtoResponse, GetPaginationQuery, GetUsersDtoResponse } from "../../../types/userTypes";

export default interface IAdminService {
  getAllCompanies(query:GetPaginationQuery):Promise<GetCompanyDtoResponse>
  getAllUsers(query:GetPaginationQuery):Promise<GetUsersDtoResponse>
  blockUser(id: string):Promise<UserServiceResponse>;
  handleCompanyRequest(companyId: string, action: string):Promise<{company:IComapnyRequest, message:string}> ;
  approvedCompany(query:GetPaginationQuery):Promise<GetApprovedCompanyDtoResponse> ;
  handleCompanyBlockStatus(comapnyId:string):Promise<{company:IcomapnyBlock, message:string}>
}
