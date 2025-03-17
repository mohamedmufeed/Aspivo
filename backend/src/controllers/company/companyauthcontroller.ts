import { Request, Response } from "express";
import { CompanyAuthService } from "../../services/compnyService/comanyauthservice.js";


const companyService = new CompanyAuthService();
export const register= async (req: Request, res: Response) => {
  try {
    const userId=req.params.id
    const { companyName, email, kyc } = req.body;
    const { company} = await companyService.register(
      companyName,
      email,
      kyc,
      userId,
    );

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error on company signup",error });
  }
};

