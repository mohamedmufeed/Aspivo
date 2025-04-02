import { CompanyProfileService } from "../../services/compnyService/companyProfileService.js";
import { Request,Response } from "express";
import HttpStatus from "../../utils/httpStatusCode.js";
const companyProfileService= new CompanyProfileService()

export const getProfile=async(req:Request,res:Response)=>{
try {
    const companyId=req.params.id
    const response=await companyProfileService.getProfile(companyId)
    res.status(HttpStatus.OK).json(response)
} catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
}
}