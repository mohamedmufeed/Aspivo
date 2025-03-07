import { AuthRepostry } from "../repositories/userRepositories.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";
import crypto from "crypto";
import { resendOtpMail, sendOtpEmail } from "../utils/sendOtp.js";
import { error } from "console";

const authRepostry = new AuthRepostry();
export class AuthService {
  async regitser(userName: string, email: string, password: string) {
    const existUser = await authRepostry.findByEmail(email);
    if (existUser) {
      throw new Error("User alredy exists");
    }

    const hashePassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const { user } = await authRepostry.register(
      userName,
      email,
      hashedOtp,
      otpExpires,
      hashePassword
    );

    await sendOtpEmail(email, otp);
    return { user };
  }

  async login(email: string, password: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) {
      throw new Error("User does not exist");
    }

    if (!user.verified) {
      throw new Error("Email not verified. Please verify your OTP.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user.id, user.isAdmin);
    return { user, token };
  }

  async verifyotp(email: string, otp: string) {
    const user = await authRepostry.findByEmail(email);

    if (!user) throw new Error("User does not exist");

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      !user.otpExpires ||
      !(user.otpExpires instanceof Date) ||
      user.otp != hashedOtp ||
      new Date() > new Date(user.otpExpires)
    ) {
      throw new Error("Invalid otp or otp expires");
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return { user, message: "OTP verified successfully" };
  }

  async resendOtp(email: string) {
    const user = await authRepostry.findByEmail(email);
    if (!user) throw new Error("User Not found");

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
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();
    await sendOtpEmail(email, otp);
    return { user,message:" Email send suncessfully for Forgot password"}
  }
  

  async  resetPassword(email:string,newPassword:string){
    const user= await authRepostry.findByEmail(email)
    if(!user) throw new Error ('User not foud')
  
      const hashePassword = await bcrypt.hash(newPassword,10)
      user.password=hashePassword
      await user.save()
      return {user, message:" Pass word reset sucesess"}
  }
}
