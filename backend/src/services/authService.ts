import { AuthRepostry } from "../repositories/userRepositories.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";
import crypto from "crypto";
import { resendOtpMail, sendOtpEmail } from "../utils/sendOtp.js";
import { error } from "console";
import { ProfileTypes } from "../types/userTypes.js";
import { use } from "passport";
import cloudinary from "../config/cloudinaryConfig.js";


const authRepostry = new AuthRepostry();
export class AuthService {
  async regitser(userName: string, email: string, password: string) {
    const existUser = await authRepostry.findByEmail(email);
    if (existUser) {
      throw { status: 404, message: "User alredy exists" };
    }

    const hashePassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    const { user,token } = await authRepostry.register(
      userName,
      email,
      hashedOtp,
      otpExpires,
      hashePassword,
    );

    await sendOtpEmail(email, otp);
    return { user,token };
  }

  async login(email: string, password: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) {
      throw { status: 404, message: "User does not exist" };
    }

    if (!user.verified) {
      throw {
        status: 403,
        message: "Email not verified. Please verify your OTP.",
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const token = generateToken(user.id, user.isAdmin);
    return { user, token };
  }

  async verifyotp(email: string, otp: string) {
    const user = await authRepostry.findByEmail(email);

    if (!user) {
      throw { status: 404, message: "User does not exist" };
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (!user.otpExpires || !(user.otpExpires instanceof Date)) {
      throw { status: 400, message: "OTP expiration time is invalid" };
    }

    if (user.otp !== hashedOtp) {
      throw { status: 401, message: "Invalid OTP" };
    }

    if (new Date() > new Date(user.otpExpires)) {
      throw { status: 403, message: "OTP has expired" };
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return { user, message: "OTP verified successfully" };
  }

  async resendOtp(email: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) {
      throw { status: 404, message: "User does not exist" };
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(newOtp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();

    const mailSent = await resendOtpMail(email, newOtp);

    return { user };
  }

  async forgotPassword(email: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) {
      throw { status: 404, message: "User does not exist" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();
    await sendOtpEmail(email, otp);
    return { user, message: " Email send suncessfully for Forgot password" };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) throw new Error("User not foud");

    const hashePassword = await bcrypt.hash(newPassword, 10);
    user.password = hashePassword;
    await user.save();
    return { user, message: " Password reset sucesess" };
  }



}
