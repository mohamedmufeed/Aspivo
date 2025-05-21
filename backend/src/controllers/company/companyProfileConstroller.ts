import { Request, Response } from "express";
import { CompanyProfileService } from "../../services/compnyService/companyProfileService";
import HttpStatus from "../../utils/httpStatusCode";
import ICompanyProfileController from "../../interface/controller/company/comapnyProfileInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import logger from "../../logger";
import IProfileService from "../../interface/service/company/profileInterface";


export class CompanyProfileController implements ICompanyProfileController {
  constructor(private _companyProfileService: IProfileService) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const response = await this._companyProfileService.getProfile(companyId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:  err.message||ERROR_MESSAGES.SERVER_ERROR });
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

      const response = await this._companyProfileService.editCompanyProfile(companyId, data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      logger.error("Error editing company profile", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  editCompanyDescription = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const { description } = req.body;
      const response = await this._companyProfileService.editCompanyDescription(companyId, description);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  addTechStack = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const { stack } = req.body;
      const response = await this._companyProfileService.addTechStack(companyId, stack);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:  err.message|| ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  editTeam = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const members = req.body;
      const response = await this._companyProfileService.editTeam(companyId, members);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      logger.error("Error editing team", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  editContact = async (req: Request, res: Response) => {
    try {
      const companyId = req.params.id;
      const contact = req.body;
      const response = await this._companyProfileService.editContact(companyId, contact);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
