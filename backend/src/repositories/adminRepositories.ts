import User from "../models/user";
import Company, { CompanyDocument } from "../models/company";
import Subscription from "../models/Subscription";
import IAdminRepostry from "../interface/repositories/adminRepository";
import { GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetSubscriptionResponse, GetUsersResponse } from "../types/userTypes";
import { PipelineStage } from "mongoose";


export class AdminRepostry implements IAdminRepostry {
  constructor(private userModel: typeof User, private companyModel: typeof Company, private subscriptionModel: typeof Subscription) { }
  async getAllUsers({ page, limit, searchQuery }: GetPaginationQuery): Promise<GetUsersResponse> {
    const skip = (page - 1) * limit;

    const searchFilter = searchQuery
      ? {
        $or: [
          { userName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }
      : {};

    const users = await this.userModel.find(searchFilter).skip(skip).limit(limit);
    const totalUsers = await this.userModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalUsers / limit);

    return { users, totalUsers, totalPages };
  }

  async findById(id: string) {
    return await this.userModel.findById(id)
  }

  async findAllCompany({ page, limit, searchQuery }: GetPaginationQuery): Promise<GetCompanyResponse> {
    const skip = (page - 1) * limit
    const searchFilter = searchQuery
      ? {
        $or: [
          { companyName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ]
      }
      : {}
    const companies = await this.companyModel.find(searchFilter).skip(skip).limit(limit)
    const totalRequest = await this.companyModel.countDocuments(searchFilter)
    const totalPages = Math.ceil(totalRequest / limit)
    return { companies, totalRequest, totalPages }
  }

  async findComapny(companyId: string): Promise<CompanyDocument | null> {
    return await this.companyModel.findById(companyId)
  }
  async findByIdAndUpdateStatus(companyId: string, status: string): Promise<CompanyDocument | null> {
    return await this.companyModel.findByIdAndUpdate(companyId, { status: status })
  }

  async findApprovedCompany({ page, limit, searchQuery }: GetPaginationQuery): Promise<GetApprovedCompanyResponse> {
    const skip = (page - 1) * limit
    const searchFilter = {
      status: "Approved", 
      ...(searchQuery && {
        $or: [
          { companyName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ]
      })
    };
    const company = await this.companyModel.find(searchFilter).skip(skip).limit(limit)
    const totalCompany = await this.companyModel.countDocuments(searchFilter)
    const totalPages = Math.ceil(totalCompany / limit)
    return { company, totalCompany, totalPages }
  }


  async findSubscriptions({ page, limit, searchQuery }: GetPaginationQuery): Promise<GetSubscriptionResponse> {
    const skip = (page - 1) * limit;
  
    const matchStage: PipelineStage.Match = searchQuery
      ? {
          $match: {
            $or: [
              { "user.firstName": { $regex: searchQuery, $options: "i" } },
              { "user.lastName": { $regex: searchQuery, $options: "i" } },
              { "user.email": { $regex: searchQuery, $options: "i" } },
            ],
          },
        }
      : { $match: {} };
  
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      matchStage,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          plan: 1,
          status: 1,
          createdAt: 1,
          user: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
        },
      },
    ];
  
    const data = await this.subscriptionModel.aggregate(pipeline);
  
    const totalResult = await this.subscriptionModel.aggregate([
      pipeline[0],
      pipeline[1],
      matchStage,
      { $count: "total" },
    ]);
  
    const totalSubscription = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalSubscription / limit);
    return { subscription: data, totalSubscription, totalPages };
  }
  

  async findSubscriptionById(subscriptionId: string) {
    return await this.subscriptionModel.findById(subscriptionId)
  }

}

