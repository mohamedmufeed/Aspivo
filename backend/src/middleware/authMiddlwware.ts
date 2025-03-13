import { Response,Request,NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config()


const protect=(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies?.access_token;

if(!token){

     res.status(401).json({message:"Unauthorized"})
     return
}
try {

    const decode=jwt.verify(token,process.env.JWT_SECRET as string)
    req.user=decode

    next()
} catch (error) {
   res.status(403).json({message:"Invalid token or expires"}) 
}
}
export default protect