import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";

export default interface IAdminService {
  blockUser(id: string): UserServiceResponse;
  handleCompanyRequest(companyId: string, action: string): CompanySerivceResponse;
  approvedCompany(): CompanySerivceResponse;
}
