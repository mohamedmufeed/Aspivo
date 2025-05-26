
import { CompanyProfileRepositiories } from "../../repositories/companyProfileRepositories";

import HttpStatus from "../../utils/httpStatusCode";
import { IComapny, TeamMember } from "../../types/companyTypes";
import { Contact } from "../../types/companyTypes";
import IProfileService from "../../interface/service/company/profileInterface";
import { ICompany } from "../../models/company";
import { ICompanyProfileRepositories } from "../../interface/repositories/companyProfileRepostries";
import { COMPANY_CONTACT_UPDATED_SUCCESSFULLY, COMPANY_DESCRIPTION_UPDATED_SUCCESSFULLY, COMPANY_NOT_FOUND, COMPANY_PROFILE_UPDATED_SUCCESSFULLY, COMPANY_STACK_ADDED_SUCCESSFULLY, COMPANY_TEAM_UPDATED_SUCCESSFULLY, INVALID_DATE, STACK_ALREADY_EXISTS } from "../../constants/message";
export class CompanyProfileService implements IProfileService {
  constructor(private _companyRepo: ICompanyProfileRepositories) { }

  async getProfile(companyId: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      companyId
    );
    if (!company) throw new Error(COMPANY_NOT_FOUND);
    return { company, message: COMPANY_PROFILE_UPDATED_SUCCESSFULLY };
  }


  async editCompanyProfile(companyId: string, data: IComapny): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      companyId
    );
    if (!company) throw new Error(COMPANY_NOT_FOUND);
    if (data.logo) {
      company.logo = data.logo;
    }
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      if (!isNaN(startDate.getDate())) {
        company.startDate = startDate;
      } else {
        throw { status: HttpStatus.BAD_REQUEST, message: INVALID_DATE };
      }
    }

    company.companyName = data.companyName || company.companyName;
    company.companyUrl = data.companyUrl || company.companyUrl;
    company.employees = data.employees || company.employees;
    company.location = data.location || company.location;
    company.industry = data.industry || company.industry;
    await company.save();
    return { company, message: COMPANY_PROFILE_UPDATED_SUCCESSFULLY };
  }

  async editCompanyDescription(companyId: string, data: string): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      companyId
    );
    if (!company) throw new Error(COMPANY_NOT_FOUND);

    if (data) {
      company.description = data || company.description;
    }
    await company.save();
    return { company, message: COMPANY_DESCRIPTION_UPDATED_SUCCESSFULLY };
  }

  async addTechStack(comapnyId: string, stack: string[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(
      comapnyId
    );
    if (!company) throw new Error(COMPANY_NOT_FOUND);
    company.stack = Array.isArray(company.stack) ? company.stack : [];
    const newStack = stack.filter(
      (stack) =>
        !company.stack.some(
          (existingStack) => existingStack.toLowerCase() === stack.toLowerCase()
        )
    );

    if (newStack.length === 0) {
      throw { status: HttpStatus.BAD_REQUEST, message: STACK_ALREADY_EXISTS };
    }
    company.stack.push(...newStack);
    await company.save();
    return { company, message: COMPANY_STACK_ADDED_SUCCESSFULLY };
  }

  async editTeam(companyId: string, members: TeamMember[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(companyId);
    if (!company) throw new Error(COMPANY_NOT_FOUND);

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
      message: COMPANY_TEAM_UPDATED_SUCCESSFULLY
    };
  }

  async editContact(comapnyId: string, contact: Contact[]): Promise<{ company: ICompany, message: string }> {
    const company = await this._companyRepo.findCompanyById(comapnyId)
    if (!company) throw new Error(COMPANY_NOT_FOUND)
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
    return { company, message: COMPANY_CONTACT_UPDATED_SUCCESSFULLY }
  }
}
