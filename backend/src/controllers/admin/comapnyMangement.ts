import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/adminService/adminService.js";
import HttpStatus from "../../utils/httpStatusCode.js";


const adminService= new AdminService()
const adminRepostry = new AdminRepostry();
export const getCompanies= async(req:Request,res:Response)=>{
    try {
        const company=  await adminRepostry.findAllCompany()
        res.status(HttpStatus.OK).json({company , message:"Fetch comapny sucsees full"})
    } catch (error) {
        console.log("error from fetching all company ", error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Interanl server error"})
    }
}
 export const handleCompanyRequest= async(req:Request,res:Response)=>{
    try {
        const {comapnyId,action}=req.body

        const comapny= await adminService.handleCompanyRequest(comapnyId,action)
        res.status(HttpStatus.OK).json(comapny)
    } catch (error) {
        console.log("error in the handling req",error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
 }

 export const approvedCompanies=async(req:Request,res:Response)=>{
    try {
    const response= await adminService.approvedCompany()
    res.status(HttpStatus.OK).json(response)
    
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
 }

  