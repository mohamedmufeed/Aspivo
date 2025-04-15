// controllers/authController.ts
import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { generateRefreshToken, generateToken } from "../../utils/jwt.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import IAuthController from "../../interface/controller/user/authControllerInterface.js";

export class AuthController  implements IAuthController{
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userName, email, password } = req.body;
      const { user, token, refreshToken } = await this.authService.regitser(userName, email, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error: any) {
      res
        .status(error?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal Server Error" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await this.authService.login(email, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 6 * 60 * 60 * 1000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user });
    } catch (error: any) {
      res
        .status(error?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal Server Error" });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const user = await this.authService.verifyotp(email, otp.trim());

      res.status(HttpStatus.OK).json({
        message: "OTP validation success",
        user: user,
      });
    } catch (error: any) {
      res
        .status(error?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal Server Error" });
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: "OTP Resent successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "OTP resend failed",
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);

      res.status(HttpStatus.OK).json({ message: "Forgot password OTP sent successfully" });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, newPassword } = req.body;
      await this.authService.resetPassword(email, newPassword);

      res.status(HttpStatus.OK).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Password reset failed",
      });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refresh_token;
      const newToken = await this.authService.refreshToken(refreshToken);

      res.cookie("access_token", newToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({ accessToken: newToken });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  googleCallBack = (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Authentication Failed" });
      return;
    }

    const user = req.user as any;
    const accessToken = generateToken(user.id, user.isAdmin);
    const refreshToken = generateRefreshToken(user.id, user.isAdmin);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/");
  };

  getGoogleUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
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
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error in Google auth" });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "User ID is required" });
        return;
      }

      res.cookie("access_token", " ", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(0),
      });

      res.cookie("refresh_token", " ", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(0),
      });

      res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Logout failed", error: error });
    }
  };
}
