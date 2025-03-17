import { Request, Response } from "express";
import { ComapnayProfileService } from "../../services/compnyService/comapnyProfileService.js";
const comapanyProfileService= new ComapnayProfileService()

export const fetchCompany=async(req:Request,res:Response)=>{
    try {

        const userId=req.params.id
        const company= await  comapanyProfileService.fetchCompany(userId)
        res.status(200).json({company})
        
    } catch (error) {
        console.log("error in fetching company",error)
        res.status(500).json({message:"Internal server error"})
    }
}