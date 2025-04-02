import { CompanySerivceResponse, UserServiceResponse } from "../../../types/interfaceTypes";

export default interface IAdminService{
    blockUser(id:string):UserServiceResponse;
    handleCompanyRequest(comapnyId:string,action:string):CompanySerivceResponse;
    approvedCompany():CompanySerivceResponse
}