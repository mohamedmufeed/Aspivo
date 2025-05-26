
import { sendNotification } from "../../server";
import IAdminService from "../../interface/service/admin/adminInterface";
import { GetApprovedCompanyDtoResponse, GetCompanyDtoResponse, GetPaginationQuery, GetUsersDtoResponse } from "../../types/userTypes";
import { IUser } from "../../models/user";
import { CompanyDocument } from "../../models/company";
import { handleCompanyBlockStatusDto, handleCompanyReqDto, mappedCompanies, mappedUsers, userBlockDto } from "../../utils/dto/adminDto";
import IAdminRepostry from "../../interface/repositories/adminRepository";
import { INotificationRepository } from "../../interface/repositories/NotifictatonRepository";
import { IComapnyRequest } from "../../types/companyTypes";
import { COMPANY_BLOCK_STATUS_CHANGED, COMPANY_NOT_FOUND, COMPANY_STATUS_CHANGED, COMPANY_STATUS_UPDATE_FAILED, USER_NOT_FOUND, USER_STATUS_CHANGED, USER_STATUS_UPDATE_FAILED } from "../../constants/message";


export class AdminService implements IAdminService {
  constructor(private _adminRepository: IAdminRepostry, private _notificationRespository: INotificationRepository) { }

  async getAllCompanies(query: GetPaginationQuery): Promise<GetCompanyDtoResponse> {
    const response = await this._adminRepository.findAllCompany(query);
    const mappedResponse = {
      companies: response.companies.map((company) => mappedCompanies(company)),
      totalPages: response.totalPages,
      totalRequest: response.totalRequest
    }
    return mappedResponse
  }
  async getAllUsers(query: GetPaginationQuery): Promise<GetUsersDtoResponse> {
    const response = await this._adminRepository.getAllUsers(query);
    const mappedResponse = {
      totalUsers: response.totalUsers,
      totalPages: response.totalPages,
      users: response.users.map((user) => mappedUsers(user))
    }
    return mappedResponse
  }

  async blockUser(id: string) {
    const user = await this._adminRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    const updatedUser = await this._adminRepository.findByIdAndUpdateBlockStatus(id, user.isBlocked)
    if (!updatedUser) throw new Error(USER_STATUS_UPDATE_FAILED);
    const userDto=userBlockDto(updatedUser)
    return { user: userDto, message: USER_STATUS_CHANGED};
  }

  async handleCompanyRequest(companyId: string, action: string): Promise<{ company: IComapnyRequest, message: string }> {
    const existingcompany = await this._adminRepository.findComapny(companyId);
    if (!existingcompany) throw new Error(COMPANY_NOT_FOUND);
    let status = ""
    if (action === "Approved") {
      status = action || "Approved";
    } else if (action === "Declined") {
      status = action || "Declined";
    } else {
      status = "Pending";
    }
    const company = await this._adminRepository.findByIdAndUpdateStatus(companyId, status)
    if (!company) throw new Error(COMPANY_STATUS_UPDATE_FAILED)
    const message = `Your company '${company.companyName}' has been ${action}!`;
    await this._notificationRespository.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    const comapanyDto=handleCompanyReqDto(company)
    return { company:comapanyDto, message: COMPANY_STATUS_CHANGED };
  }

  async approvedCompany(query: GetPaginationQuery): Promise<GetApprovedCompanyDtoResponse> {
    const response = await this._adminRepository.findApprovedCompany(query);
    const mappedResponse = {
      company: response.company.map((company) => mappedCompanies(company)),
      totalPages: response.totalPages,
      totalCompany: response.totalCompany
    }
    return mappedResponse
  }

  async handleCompanyBlockStatus(comapnyId: string) {
    const company = await this._adminRepository.findComapny(comapnyId)
    if (!company) throw new Error(COMPANY_NOT_FOUND)
    const blockStatus = !company.isBlocked
    const updatedCompany = await this._adminRepository.findByIdAndUpdateCompanyBlockStatus(comapnyId, blockStatus)
    if(!updatedCompany) throw new Error(USER_NOT_FOUND)
      const comapanyDto=handleCompanyBlockStatusDto(updatedCompany)
    return { company: comapanyDto, message: COMPANY_BLOCK_STATUS_CHANGED }
  }

}
