import { threadId } from "worker_threads";
import { CompanyProfileRepositiories } from "../../repositories/companyProfileRepositories.js";
import { IComapny } from "../../types/companyTypes.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import { use } from "passport";
export class CompanyProfileService {
  private companyProfileRepositories: CompanyProfileRepositiories;
  constructor() {
    this.companyProfileRepositories = new CompanyProfileRepositiories();
  }
  async getProfile(companyId: string) {
    const company = await this.companyProfileRepositories.findCompanyById(
      companyId
    );
    if (!company) throw new Error("Company Not found");
    return { company, message: "Company Profile updated successfully" };
  }

  async editCompanyProfile(companyId: string, data: IComapny) {
    const company = await this.companyProfileRepositories.findCompanyById(
      companyId
    );
    if (!company) throw new Error("Comapny not found");
    if (data.logo) {
      company.logo = data.logo;
    }
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      if (!isNaN(startDate.getDate())) {
        company.startDate = startDate;
      } else {
        throw { status: HttpStatus.BAD_REQUEST, message: "Invalid date" };
      }
    }

    company.companyName = data.companyName || company.companyName;
    company.companyUrl = data.companyUrl || company.companyUrl;
    company.employees = data.employees || company.employees;
    company.location = data.location || company.location;
    company.industry = data.industry || company.industry;
    await company.save();
    return { company, message: "Comapny Profile updated sucsess fully" };
  }

  async editCompanyDescription(companyId: string, data: string) {
    const comapny = await this.companyProfileRepositories.findCompanyById(
      companyId
    );
    if (!comapny) throw new Error("Company not found");

    if (data) {
      comapny.description = data || comapny.description;
    }
    await comapny.save();
    return { comapny, message: "Comapny description updated sucess fully" };
  }

  async addTechStack(comapnyId: string, stack: string[]) {
    const company = await this.companyProfileRepositories.findCompanyById(
      comapnyId
    );
    if (!company) throw new Error("Comapny not found");
    company.stack = Array.isArray(company.stack) ? company.stack : [];
    const newStack = stack.filter(
      (stack) =>
        !company.stack.some(
          (existingStack) => existingStack.toLowerCase() === stack.toLowerCase()
        )
    );

    if (newStack.length === 0) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Stack alredy exists" };
    }
    company.stack.push(...newStack);
    await company.save();
    return { company, message: "Comapny stack addedd sucsessfilly" };
  }
}
