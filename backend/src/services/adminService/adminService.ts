
import { sendNotification } from "../../server";
import IAdminService from "../../interface/service/admin/adminInterface";
import { GetApprovedCompanyDtoResponse, GetCompanyDtoResponse, GetPaginationQuery, GetUsersDtoResponse } from "../../types/userTypes";
import { IUser } from "../../models/user";
import { CompanyDocument } from "../../models/company";
import { handleCompanyBlockStatusDto, handleCompanyReqDto, mappedCompanies, mappedUsers, userBlockDto } from "../../utils/dto/adminDto";
import IAdminRepostry from "../../interface/repositories/adminRepository";
import { INotificationRepository } from "../../interface/repositories/NotifictatonRepository";
import { IComapnyRequest } from "../../types/companyTypes";
import { MESSAGES } from "../../constants/message";

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
    if (!user) throw new Error(MESSAGES.USER.NOT_FOUND);
    const updatedUser = await this._adminRepository.findByIdAndUpdateBlockStatus(id, user.isBlocked)
    if (!updatedUser) throw new Error("Failed to update user status");
    const userDto=userBlockDto(updatedUser)
    return { user: userDto, message: "User status changed successfully" };
  }

  async handleCompanyRequest(companyId: string, action: string): Promise<{ company: IComapnyRequest, message: string }> {
    const existingcompany = await this._adminRepository.findComapny(companyId);
    if (!existingcompany) throw new Error("Company not found");
    let status = ""
    if (action === "Approved") {
      status = action || "Approved";
    } else if (action === "Declined") {
      status = action || "Declined";
    } else {
      status = "Pending";
    }
    const company = await this._adminRepository.findByIdAndUpdateStatus(companyId, status)
    if (!company) throw new Error("Comapny Not found or Eror in updaing status")
    const message = `Your company '${company.companyName}' has been ${action}!`;
    await this._notificationRespository.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    const comapanyDto=handleCompanyReqDto(company)
    return { company:comapanyDto, message: "Company status changed successfully" };
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
    if (!company) throw new Error("Comapny not found")
    const blockStatus = !company.isBlocked
    const updatedCompany = await this._adminRepository.findByIdAndUpdateCompanyBlockStatus(comapnyId, blockStatus)
    if(!updatedCompany) throw new Error("Failed to update user status")
      const comapanyDto=handleCompanyBlockStatusDto(updatedCompany)
    return { company: comapanyDto, message: "Comapny Block status handeled sucsess " }
  }

}
