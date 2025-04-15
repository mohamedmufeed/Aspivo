import { Request, Response } from "express";
import { CompanyProfileService } from "../../services/compnyService/companyProfileService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import ICompanyProfileController from "../../interface/controller/company/comapnyProfileInterface.js";

export class CompanyProfileController implements ICompanyProfileController {
  constructor(private companyProfileService: CompanyProfileService) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const response = await this.companyProfileService.getProfile(companyId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  editCompanyProfile = async (req: Request, res: Response) => {
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
        location,
        employees,
        logo,
      };

      const response = await this.companyProfileService.editCompanyProfile(companyId, data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error editing company profile", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  editCompanyDescription = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const { description } = req.body;
      const response = await this.companyProfileService.editCompanyDescription(companyId, description);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  addTechStack = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const { stack } = req.body;
      const response = await this.companyProfileService.addTechStack(companyId, stack);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  editTeam = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const members = req.body;
      const response = await this.companyProfileService.editTeam(companyId, members);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error editing team", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };

  editContact = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const contact = req.body;
      const response = await this.companyProfileService.editContact(companyId, contact);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };
}
