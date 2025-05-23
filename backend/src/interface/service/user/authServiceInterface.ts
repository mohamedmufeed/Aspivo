import { IUser } from "../../../models/user";
import { UserServiceResponse } from "../../../types/interfaceTypes";


export default interface IAuthService {
  regitser(userName: string, email: string, password: string): Promise<{ user: IUser, token: string, refreshToken: string }>;
  login(email: string, password: string): Promise<{ user: IUser, token: string, refreshToken:string }>;
  verifyotp(email: string, otp: string): Promise<{ user: IUser,  message:string }>;
  resendOtp(email: string): Promise<{ user: IUser,  message:string }>;
  forgotPassword(email: string): Promise<{ user: IUser,  message:string }>;
  resetPassword(email: string, password: string): Promise<{ user: IUser,  message:string }>;
  refreshToken(refreshToken:string):Promise<unknown>
}
