import { Request, Response } from "express";

export default interface ICompanyAuthController {
  register(req: Request, res: Response): Promise<void>;
}
