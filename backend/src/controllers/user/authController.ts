import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { promises } from "dns";
import { json } from "stream/consumers";

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userName, email, password } = req.body;

    const {user,token }= await authService.regitser(userName, email, password);
    
    res.cookie("access_token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:3600000
     })

    return res.status(201).json(user);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error
    ) {
      return res
        .status((error as any).status)
        .json({ message: (error as any).message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.cookie("access_token",token,{
     httpOnly:true,
     secure:false,
     sameSite:"strict",
     maxAge:3600000
    })

    return res.json({ user });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error
    ) {
      return res
        .status((error as any).status)
        .json({ message: (error as any).message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyotp(email, otp);
    res.status(200).json({
      message: "OTP validation success",
      user: user,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error
    ) {
      return res
        .status((error as any).status)
        .json({ message: (error as any).message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const resnsedOtp = await authService.resendOtp(email);
    return res.status(200).json({ message: "OTP Resent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "OTP resend failed",
      });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const forgotPassword = await authService.forgotPassword(email);

    return res
      .status(200)
      .json({ message: "forgot password otp send sucsessfully" });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error
    ) {
      return res
        .status((error as any).status)
        .json({ message: (error as any).message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, newPassword } = req.body;
    const resetPassword = await authService.resetPassword(email, newPassword);
    return res.status(200).json({ message: " Password reset sucsess fully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : " password  reset failed",
      });
  }
};


 export const logout= async(req:Request,res:Response)=>{

 }
