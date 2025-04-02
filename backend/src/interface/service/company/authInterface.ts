import { CompanySerivceResponse } from "../../../types/interfaceTypes";

export default interface ICompanySerive{
    register( companyName: string, email: string,kyc: string,userId: string):CompanySerivceResponse
}