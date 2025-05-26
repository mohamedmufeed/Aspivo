
import { CompanyProfileRepositiories } from "../../repositories/companyProfileRepositories";

import HttpStatus from "../../utils/httpStatusCode";
import { IComapny, TeamMember } from "../../types/companyTypes";
import { Contact } from "../../types/companyTypes";
import IProfileService from "../../interface/service/company/profileInterface";
import { ICompany } from "../../models/company";
import { ICompanyProfileRepositories } from "../../interface/repositories/companyProfileRepostries";
export class CompanyProfileService implements IProfileService {
  constructor(private _companyRepo: ICompanyProfileRepositories) { }

  async getProfile(companyId: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      companyId
    );
    if (!company) throw new Error("Company Not found");
    return { company, message: "Company Profile updated successfully" };
  }


  async editCompanyProfile(companyId: string, data: IComapny): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
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

  async editCompanyDescription(companyId: string, data: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      companyId
    );
    if (!company) throw new Error("Company not found");

    if (data) {
      company.description = data || company.description;
    }
    await company.save();
    return { company, message: "Comapny description updated sucess fully" };
  }

  async addTechStack(comapnyId: string, stack: string[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
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

  async editTeam(companyId: string, members: TeamMember[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(companyId);
    if (!company) throw new Error("Company not found");

    const existingTeam = company.team || [];

    const trimmedNewMembers = members.map((member) => ({
      position: member.position.trim(),
      name: member.name.trim()
    }));
    const membersToAdd = trimmedNewMembers.filter(
      (newMember) =>
        !existingTeam.some(
          (existing: any) =>
            existing.position === newMember.position && existing.name === newMember.name
        )
    );

    company.team.push(...membersToAdd);
    await company.save();
    return {
      company,
      message: "Company team updated successfully"
    };
  }

  async editContact(comapnyId: string, contact: Contact[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(comapnyId)
    if (!company) throw new Error("Comapny not found")
    const existingContact = company.contact || []
    console.log("Received contact:", contact);
    console.log("Type of contact:", typeof contact);

    const contactsArray = Array.isArray(contact) ? contact : [contact];
    const trimmedNewContacts = contactsArray.map((contact) => ({
      name: contact.name.trim(),
      url: contact.url.trim()
    }));
    const contactToAdd = trimmedNewContacts.filter(
      (newContact) =>
        !existingContact.some(
          (existing: any) =>
            existing.name === newContact.name && existing.url === newContact.url
        )
    )

    company.contact.push(...contactToAdd)
    await company.save()
    return { company, message: "Company contact updated successfully" }
  }
}
