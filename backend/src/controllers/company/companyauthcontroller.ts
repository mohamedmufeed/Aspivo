import { Request, Response } from "express";
import { CompanyAuthService } from "../../services/compnyService/comanyauthservice";
import HttpStatus from "../../utils/httpStatusCode";
import ICompanyAuthController from "../../interface/controller/company/companyAuthInterface";

export class CompanyAuthController  implements ICompanyAuthController{
  constructor(private _companyService: CompanyAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { companyName, email, kyc } = req.body;

      const { company } = await this._companyService.register(
        companyName,
        email,
        kyc,
        userId
      );

      res.status(HttpStatus.OK).json(company);
    } catch (error) {
      console.log("Error during company registration:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error on company signup",
        error,
      });
    }
  };
}
