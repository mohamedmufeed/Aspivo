import User from "../models/user.js";
import Company from "../models/company.js";
import Subscription from "../models/Subscription.js";
import {generateToken} from "../utils/jwt.js";
import mongoose from "mongoose";



export class AdminRepostry {
async getAllUsers(){
  return  await User.find()
}

async findById(id:string){
  return await  User.findById(id)
}
async findAllCompany(){
  return await Company.find()
}

 async findComapny(companyId:string){
  return await Company.findById(companyId)
 }

 async findApprovedCompany(){
  return await Company.find({status:"Approved"})
 }

async findSubscriptions(){
  return await Subscription.find().populate("userId" ,"firstName lastName email")  .sort({createdAt:-1})
}

async findSubscriptionById(subscriptionId:string){
return await Subscription.findById(subscriptionId)
}

}

