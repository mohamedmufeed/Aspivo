import { Request,  Response } from "express";
import { AuthService } from "../../services/authService.js";
import { promises } from "dns";
const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
  
    const user = await authService.regitser(userName, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};


 export const verifyOtp= async(req:Request,res:Response)=>{
  try {
    const {email,otp}=req.body
    const user= await authService.verifyotp(email,otp)
    res.status(200).json({ 
      message: "OTP validation success",
      user:user
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "OTP verification failed" });
  }
 }
 export const resendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const resnsedOtp = await authService.resendOtp(email);
    return res.status(200).json({ message: "OTP Resent successfully" });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "OTP resend failed" });
  }

};

export  const forgotPassword = async (req:Request ,res:Response):Promise<any>=>{
  try {
     const {email}= req.body
    const forgotPassword = await authService.forgotPassword(email)

      return res.status(200).json({message: "forgot password otp send sucsessfully"})

  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "OTP  forgot password failed" });
  }
 }

  export const resetPassword = async (req:Request,res:Response) :Promise<any>=>{
  try {
  const {email, newPassword} = req.body
  const  resetPassword = await authService.resetPassword(email,newPassword)
  return res.status(200).json({message:" Password reset sucsess fully"})
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : " password  reset failed" });
 }
  }