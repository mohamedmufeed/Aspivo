import { Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "./authMiddlwware";
import HttpStatus from "../utils/httpStatusCode";
dotenv.config();

export const adminOnly = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user?.isAdmin) {
       res.status(HttpStatus.FORBIDDEN).json({ 
        success: false, 
        message: "Access denied. Admin privileges required" 
      });
      return
    }
    
    next();
  };

 export  default adminOnly