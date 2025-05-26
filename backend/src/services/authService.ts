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
import { EMAIL_NOT_VERIFIED, FORGOT_PASSWORD_EMAIL_SENT, INVALID_CREDENTIALS, INVALID_OTP, INVALID_TOKEN, NO_REFRESH_TOKEN_FOUND, OTP_EXPIRED, OTP_RESENT_SUCCESSFULLY, OTP_VERIFIED_SUCCESSFULLY, PASSWORD_REQUIRED, PASSWORD_RESET_SUCCESSFULLY, USER_ALREADY_EXISTS, USER_NOT_FOUND } from "../constants/message";



export class AuthService implements IAuthService {
  constructor(private _authRepostry: IAuthRepository) {}
  async regitser(userName: string, email: string, password: string) {
    const existUser = await this._authRepostry.findByEmail(email);
    if (existUser) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_ALREADY_EXISTS };
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
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    if (!user.verified) {
      throw {
        status: HttpStatus.FORBIDDEN,
        message: EMAIL_NOT_VERIFIED,
      };
    }
    if(!user.password){
      throw{
        status:HttpStatus.FORBIDDEN,
        message:PASSWORD_REQUIRED
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: HttpStatus.UNAUTHORIZED, message: INVALID_CREDENTIALS};
    }

    const token = generateToken(user.id, user.isAdmin);
    const refreshToken = generateRefreshToken(user.id, user.isAdmin);
    return { user, token, refreshToken };
  }

  async verifyotp(email: string, otp: string) {
    const user = await this._authRepostry.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (!user.otpExpires || !(user.otpExpires instanceof Date)) {
      throw { status: HttpStatus.BAD_REQUEST, message: OTP_EXPIRED };
    }

    if (user.otp !== hashedOtp) {
      throw { status: HttpStatus.BAD_REQUEST, message: INVALID_OTP };
    }

    if (new Date() > new Date(user.otpExpires)) {
      throw { status: HttpStatus.FORBIDDEN, message: OTP_EXPIRED };
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return { user, message: OTP_VERIFIED_SUCCESSFULLY };
  }

  async resendOtp(email: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(newOtp).digest("hex");

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();

    await resendOtpMail(email, newOtp);

    return { user, message:OTP_RESENT_SUCCESSFULLY };
  }

  async forgotPassword(email: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;

    await user.save();
    await sendOtpEmail(email, otp);
    return { user, message: FORGOT_PASSWORD_EMAIL_SENT };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this._authRepostry.findByEmail(email);
    if (!user) throw new Error(USER_NOT_FOUND);

    const hashePassword = await bcrypt.hash(newPassword, 10);
    user.password = hashePassword;
    await user.save();
    return { user, message: PASSWORD_RESET_SUCCESSFULLY };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error(NO_REFRESH_TOKEN_FOUND);

    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_JWT_SECRET as string,
            (err, decoded: any) => {
                if (err) {
                    reject(new Error(INVALID_TOKEN));
                    return;
                }
                const newAcessToken = generateToken(decoded.id, decoded.isAdmin);
                resolve(newAcessToken);
            }
        );
    });

}

}
