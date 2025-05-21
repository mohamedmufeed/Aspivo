import Subscription from "../models/Subscription";
import User, { IUser, UserDocument } from "../models/user";
import { generateRefreshToken,  } from "../utils/jwt";
import { generateToken } from "../utils/jwt";
import mongoose from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IAuthRepository } from "../interface/repositories/userRepositories";
import Review, { IReview } from "../models/review";
import { IReviewData, UserWithPopulatedJobs } from "../types/userTypes";


export class AuthRepostry extends BaseRepository<UserDocument>  implements IAuthRepository{
  constructor(){
    super(User);
  }
  async register(
    userName: string,
    email: string,
    hashedOtp: string,
    otpExpires: Date,
    hashePassword: string
  ) {
    const user = new User({
      userName,
      email,
      password: hashePassword,
      otp: hashedOtp,
      otpExpires,
      verified: false,
    });
    const savedUser = await user.save();
    const token = generateToken(user.id, false);
    const refreshToken=generateRefreshToken(user.id,false)

    return { user: savedUser, token ,refreshToken};
  }

  async findByEmail(email: string) {
    return await User.findOne({ email, isBlocked: false });
  }
  async findById(id: string){
    return await User.findById(new mongoose.Types.ObjectId(id));
  }
  async findSubscriptions(userId:string){
    return await Subscription.find({userId})
  }
  async findbyIdAndUpdate(id:string, data:Partial<IUser>){
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async findByIdAndPopulate(id: string) {
    return await User.findById(new mongoose.Types.ObjectId(id))
      .populate({
        path: "savedJobs.jobId", 
        select: "jobTitle maximumSalary minimumSalary location typesOfEmployment", 
        populate: {
          path: "company", 
          select: "companyName logo location", 
        },
      }) .lean<UserWithPopulatedJobs | null>();
  }
  
  async addReview(reviewData:IReviewData){
    return await Review.create(reviewData)
  }

 async getReview(): Promise<(IReview & { userId: IUser })[]> {
  return await Review.find()
    .populate("userId", "profileImage firstName lastName position")
    .lean<(IReview & { userId: IUser })[]>();
}

  
}
