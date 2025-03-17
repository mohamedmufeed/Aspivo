
import mongoose from "mongoose";
import Company from "../models/company.js";
export class CompanyRepostries {
  async register(companyName: string, email: string,kyc:string,userId:string) {
 
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const company = new Company({
      companyName,
      email,
      kyc,
      verified:false,
      userId:userObjectId,
      status: "Pending",
    });
    const savedCompany = await company.save();
    return { company: savedCompany};
  }

  async findByEmail(email: string) {
    return await Company.findOne({ email });
  }
  async findByUserId(userId:string){
    const userObjectId = new mongoose.Types.ObjectId(userId)
    return await Company.findOne({ userId: userObjectId })
  }

}
