import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { promises } from "dns";
import { json } from "stream/consumers";
import { generateRefreshToken, generateToken } from "../../utils/jwt.js";

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userName, email, password } = req.body;

    const {user,token ,refreshToken}= await authService.regitser(userName, email, password);


    
    res.cookie("access_token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge: 15 * 60 * 1000 
     })

     res.cookie("refresh_token",refreshToken,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7 * 24 * 60 * 60 * 1000,
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
    const { user, token,refreshToken } = await authService.login(email, password);

  

    res.cookie("access_token",token,{
     httpOnly:true,
     secure:false,
     sameSite:"strict",
     maxAge: 6 * 60 * 60 * 1000 
    })
    res.cookie("refresh_token",refreshToken,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7 * 24 * 60 * 60 * 1000,
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
    console.log("the user after verify otp ",user)
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


export const refreshToken= async(req:Request,res:Response):Promise<void>=>{
try {
  const refreshToken= req.cookies?.refresh_token
  const newToken= await authService.refreshToken(refreshToken)
   res.status(200).json({accessToken:newToken})
} catch (error) {
  res.status(500).json({message:"Internal server errror"})
}
}


 export const googleCallBack=(req:Request,res:Response)=>{
   if(!req.user){
    res.status(401).json({message:'Authentication Failed'})
   }
   const user=req.user as any
   const accessToken= generateToken(user.id,user.isAdmin)
   const refreshToken=generateRefreshToken(user.id, user.isAdmin)
   res.cookie("access_token",accessToken,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:15 * 60 * 1000,
   })
   res.cookie("refresh_token",refreshToken,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:7 * 24 * 60 * 60 * 1000,
   })

   res.redirect("http://localhost:5173/")
 }

 export const getGoogleUser = async (req: Request, res: Response): Promise<void> => {
  try { 
    if (!req.user) {
     res.status(401).json({ message: "Not authenticated" });
     return
    }

    const user = req.user as any;

    res.json({
      _id: user.id,
      userName: user.userName,
      profileImage: user.profileImage,
      email: user.email,
      isAdmin: user.isAdmin || false,
      experiences: user.experiences || [],
      token: req.cookies.access_token || null,
    });
  } catch (error) {
  res.status(500).json({ message: "Internal server error in the google auth" });
  }
}
