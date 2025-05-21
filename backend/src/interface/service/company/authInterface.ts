import { CompanySerivceResponse } from "../../../types/interfaceTypes";

export default interface ICompanyService{
    register( companyName: string, email: string,kyc: string,userId: string):Promise<CompanySerivceResponse>
}