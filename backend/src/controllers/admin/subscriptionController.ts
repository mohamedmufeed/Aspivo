import { Response,Request } from "express";
import { SubscriptionService } from "../../services/adminService/subscriptionService.js";
import HttpStatus from "../../utils/httpStatusCode.js";

const subscriptionSerivce = new SubscriptionService();

export const getSubscriptions=async(req:Request,res:Response)=>{
    try {
        const response=await subscriptionSerivce.getSubcriptions()
        res.status(HttpStatus.OK).json(response)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const updateSubscriptionStatus=async(req:Request,res:Response)=>{
    try {
        const subscriptionId=req.params.id
        const {status}=req.body
        const response=await subscriptionSerivce.updateSubscriptionStatus(subscriptionId,status)
        res.status(HttpStatus.OK).json(response)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server Error"})
    }
}