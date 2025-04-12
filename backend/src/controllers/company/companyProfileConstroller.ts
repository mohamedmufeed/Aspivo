import { CompanyProfileService } from "../../services/compnyService/companyProfileService.js";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode.js";
const companyProfileService = new CompanyProfileService();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const response = await companyProfileService.getProfile(companyId);
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const editCompanyProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const {
      companyName,
      companyUrl,
      industry,
      startDate,
      location,
      employees,
      logo,
    } = req.body;
    const data = {
      companyName,
      companyUrl,
      industry,
      startDate,
      employees,
      location,
      logo,
    };
    const response = await companyProfileService.editCompanyProfile(
      companyId,
      data
    );
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    console.log("Error in the editing comapny profile ", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};


export const editCompanyDescription = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id
    const { description } = req.body
    const response = await companyProfileService.editCompanyDescription(companyId, description)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
  }
}


export const addTechStack = async (req: Request, res: Response) => {
  try {
    const comapnyId = req.params.id
    const { stack } = req.body
    const response = await companyProfileService.addTechStack(comapnyId, stack)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
  }
}

export const editTeam = async (req: Request, res: Response) => {
  try {
    const comapnyId = req.params.id
    const members = req.body
    const response = await companyProfileService.editTeam(comapnyId, members)
    res.status(HttpStatus.OK).json(response)
  } catch (error) {
    console.log("the error",error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server errro" })
  }
}

export const editContact=async(req:Request,res:Response)=>{
  try {
    const comapnyId=req.params.id
    const contact=req.body
    const response=await companyProfileService.editContact(comapnyId,contact)
    res.status(HttpStatus.OK).json(response)

  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
  }
}