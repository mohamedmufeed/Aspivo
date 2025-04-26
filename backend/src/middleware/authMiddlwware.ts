import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any;
}
const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };
    const user = await User.findById(decode.id);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
 

    if (user.isBlocked) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(401).json({ success: false, message: "User is blocked" });
    }
    req.user = { id: user._id.toString(), isAdmin: user.isAdmin, };
    next();
  } catch (error) {
    const err= error as Error
    res.status(401).json({ message: `Invalid token or expires${err.message}`});
  }
};


export default protect ;
