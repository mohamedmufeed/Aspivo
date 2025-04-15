import { UserServiceResponse } from "../../../types/interfaceTypes.js";
import { User } from "../../../types/userTypes.js";

export default interface IAuthService {
  regitser(userName: string, email: string, password: string): Promise<{ user: User, token: string, refreshToken: string }>;
  login(email: string, password: string): Promise<{ user: User, token: string, refreshToken: string }>;
  verifyotp(email: string, otp: string): Promise<UserServiceResponse>;
  resendOtp(email: string): Promise<UserServiceResponse>;
  forgotPassword(email: string): Promise<UserServiceResponse>;
  resetPassword(email: string, password: string): Promise<UserServiceResponse>;
}
