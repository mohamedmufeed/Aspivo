import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import logger from "../logger";
const generateToken = (
  id: string | mongoose.Types.ObjectId | undefined,
  isAdmin: boolean | undefined
): string => {
  logger.info(`id ${id} role ${isAdmin}`)
  return jwt.sign({ id: id, role: isAdmin }, process.env.JWT_SECRET as string, {
    expiresIn: "6h",
  });
};

const generateRefreshToken=(id:string|mongoose.Types.ObjectId|undefined, isAdmin:boolean|undefined):string=>{
return jwt.sign({id:id,role:isAdmin},process.env.REFRESH_JWT_SECRET as string,{
expiresIn:"7d"
})
}




 export  {generateToken, generateRefreshToken}