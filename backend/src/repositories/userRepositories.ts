import Subscription from "../models/Subscription.js";
import User from "../models/user.js";
import { generateRefreshToken,  } from "../utils/jwt.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

export class AuthRepostry {
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
  async findById(id: string) {
    return await User.findById(new mongoose.Types.ObjectId(id));
  }
  async findSubscriptions(userId:string){
    return await Subscription.find({userId})
  }
}
