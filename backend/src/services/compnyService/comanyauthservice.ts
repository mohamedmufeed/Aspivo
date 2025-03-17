import { CompanyRepostries } from "../../repositories/companyRepositories.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOtpEmail } from "../../utils/sendOtp.js";
const companyRepositories = new CompanyRepostries();
export class CompanyAuthService {
  async register(
    companyName: string,
    email: string,
    kyc: string,
    userId: string,
  ) {
    const existCompany = await companyRepositories.findByEmail(email);
    if (existCompany) {
      throw { status: 404, message: "Company alredy exists" };
    }
    const { company } = await companyRepositories.register(
      companyName,
      email,
      kyc,
      userId,
    );
    await company.save();
    return { company };
  }

}
