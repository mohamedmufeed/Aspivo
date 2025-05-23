import { AuthRepostry } from "../repositories/userRepositories";
import bcrypt from "bcryptjs";
import {generateToken } from "../utils/jwt";
import { generateRefreshToken } from "../utils/jwt";
import crypto from "crypto";
import { resendOtpMail, sendOtpEmail } from "../utils/sendOtp";
import jwt from "jsonwebtoken";
import IAuthService from "../interface/service/user/authServiceInterface";
import HttpStatus from "../utils/httpStatusCode";
import { http } from "winston";
import { IAuthRepository } from "../interface/repositories/userRepositories";



export class AuthService implements IAuthService {
  constructor(private _authRepostry: IAuthRepository) {}
  async regitser(userName: string, email: string, password: string) {
    const existUser = await this._authRepostry.findByEmail(email);
    if (existUser) {
      throw { status: HttpStatus.NOT_FOUND, message: "User alredy exists" };
    }

    const hashePassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    const { user, token, refreshToken } = await this._authRepostry.register(
      userName,
      email,
      hashedOtp,
      otpExpires,
      hashePassword
    );

    await sendOtpEmail(email, otp);
    return { user, token, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: "User does not exist" };
    }

    if (!user.verified) {
      throw {
        status: HttpStatus.FORBIDDEN,
        message: "Email not verified. Please verify your OTP.",
      };
    }
    if(!user.password){
      throw{
        status:HttpStatus.FORBIDDEN,
        message:"Password is required for this action."
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: HttpStatus.UNAUTHORIZED, message: "Invalid credentials" };
    }

    const token = generateToken(user.id, user.isAdmin);
    const refreshToken = generateRefreshToken(user.id, user.isAdmin);
    return { user, token, refreshToken };
  }

  async verifyotp(email: string, otp: string) {
    const user = await this._authRepostry.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: "User does not exist" };
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (!user.otpExpires || !(user.otpExpires instanceof Date)) {
      throw { status: HttpStatus.BAD_REQUEST, message: "OTP expiration time is invalid" };
    }

    if (user.otp !== hashedOtp) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Invalid OTP" };
    }

    if (new Date() > new Date(user.otpExpires)) {
      throw { status: HttpStatus.FORBIDDEN, message: "OTP has expired" };
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return { user, message: "OTP verified successfully" };
  }

  async resendOtp(email: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: "User does not exist" };
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(newOtp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();

    await resendOtpMail(email, newOtp);

    return { user, message:"User otp resnsed sucsess fully" };
  }

  async forgotPassword(email: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: "User does not exist" };
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
    const user = await this._authRepostry.findByEmail(email);
    if (!user) throw new Error("User not foud");

    const hashePassword = await bcrypt.hash(newPassword, 10);
    user.password = hashePassword;
    await user.save();
    return { user, message: " Password reset sucesess" };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error("No refresh token found");

    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_JWT_SECRET as string,
            (err, decoded: any) => {
                if (err) {
                    reject(new Error("Invalid Token"));
                    return;
                }
                const newAcessToken = generateToken(decoded.id, decoded.isAdmin);
                resolve(newAcessToken);
            }
        );
    });

}

}
