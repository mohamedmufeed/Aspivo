import { Request, Response } from "express";
import { AdminRepostry } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/adminService.js";

const adminService= new AdminService()
const adminRepostry = new AdminRepostry();
export const getCompanies= async(req:Request,res:Response)=>{
    try {
        const company=  await adminRepostry.findAllCompany()
        res.status(200).json({company , message:"Fetch comapny sucsees full"})
    } catch (error) {
        console.log("error from fetching all company ", error)
        res.status(500).json({message:"Interanl server error"})
    }
}