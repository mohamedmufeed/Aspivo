import { CompanyRepostries } from "../../repositories/companyRepositories.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOtpEmail } from "../../utils/sendOtp.js";

export class CompanyAuthService {
  constructor(private companyRepositories: CompanyRepostries) {}
  async register(
    companyName: string,
    email: string,
    kyc: string,
    userId: string
  ) {
    const existCompany = await this.companyRepositories.findByEmail(email);
    if (existCompany) {
      throw { status: 404, message: "Company alredy exists" };
    }
    const { company } = await this.companyRepositories.register(
      companyName,
      email,
      kyc,
      userId
    );
    await company.save();
    return { company, message: "Comapny refited sucesssfully" };
  }
}
