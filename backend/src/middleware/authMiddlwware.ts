import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}
const protect =  async(
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
    const decode = jwt.verify(token, process.env.JWT_SECRET||"" ) as {id:string};
    const user = await User.findById(decode.id);
    if (!user) {
       res.status(401).json({ success: false, message: "User not found" });
       return
  }

  if (user.isBlocked) {
    res.cookie("access_token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(0),
    });
    res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(0),
    });
     res.status(401).json({ success: false, message: "User is blocked" });
}
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token or expires" });
  }
};
export default protect;
