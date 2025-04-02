import { CompanyProfileRepositiories } from "../../repositories/companyProfileRepositories.js";

export class CompanyProfileService {
  private companyProfileRepositories: CompanyProfileRepositiories;
  constructor() {
    this.companyProfileRepositories = new CompanyProfileRepositiories();
  }
  async getProfile(companyId: string) {
    const company = await this.companyProfileRepositories.findCompanyById(companyId);
    if (!company) throw new Error("Company Not found");
    return {company , message:"Comapny detail fetched sucessfully"}
  }
}
