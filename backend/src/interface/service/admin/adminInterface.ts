import { ICompany } from "../../../models/company";
import { Company } from "../../../types/companyTypes";
import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";

export default interface IAdminService {
  getAllCompanies():Promise<ICompany[]>
  blockUser(id: string):Promise<UserServiceResponse>;
  handleCompanyRequest(companyId: string, action: string):Promise<CompanySerivceResponse> ;
  approvedCompany():Promise<{company:ICompany[], message:string}> ;
}
