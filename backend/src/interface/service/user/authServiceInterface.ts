import { UserServiceResponse } from "../../../types/interfaceTypes";
import { User } from "../../../types/userTypes";

export default interface IAuthService{
    regitser(userName:string,email:string,password:string):{user:User,token:string,refreshToken:string}
    login(email:string,password:string):{user:User,token:string,refreshToken:string},
    verifyotp(email:string, otp:string):UserServiceResponse;
    resendOtp(email:string):UserServiceResponse
    forgotPassword(email:string):UserServiceResponse;
    resetPassword(email:string,password:string):UserServiceResponse;
}