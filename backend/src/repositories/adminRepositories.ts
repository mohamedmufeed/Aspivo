import User from "../models/user.js";
import Company from "../models/company.js";
import Subscription from "../models/Subscription.js";
import {generateToken} from "../utils/jwt.js";
import mongoose from "mongoose";
import IAdminRepostry from "../interface/repositories/adminRepository.js";



export class AdminRepostry {
  constructor(private userModel: typeof User , private companyModel: typeof Company, private subscriptionModel: typeof Subscription) {}
async getAllUsers(){
  return  await this.userModel.find()
}

async findById(id:string){
  return await this.userModel.findById(id)
}
async findAllCompany(){
  return await this.companyModel.find()
}

 async findComapny(companyId:string){
  return await this.companyModel.findById(companyId)
 }

 async findApprovedCompany(){
  return await this.companyModel.find({status:"Approved"})
 }

async findSubscriptions(){
  return await this.subscriptionModel.find().populate("userId" ,"firstName lastName email").sort({createdAt:-1})
}

async findSubscriptionById(subscriptionId:string){
return await this.subscriptionModel.findById(subscriptionId)
}

}

