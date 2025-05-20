import ICompanySerive from "../../interface/service/company/authInterface";
import { CompanyRepostries } from "../../repositories/companyRepositories";


export class CompanyAuthService implements ICompanySerive {
  constructor(private _companyRepositories: CompanyRepostries) { }
  async register(
    companyName: string,
    email: string,
    kyc: string,
    userId: string
  ) {
    const existCompany = await this._companyRepositories.findByEmail(email);
    if (existCompany) {
      throw { status: 404, message: "Company alredy exists" };
    }

    const { company } = await this._companyRepositories.register(
      companyName,
      email,
      kyc,
      userId
    );
    const user = await this._companyRepositories.findUser(userId)
    if (user?.subscription) {
      company.subscription = {
        subscriptionId: user.subscription.subscriptionId,
        plan: user.subscription.plan,
        status: user.subscription.status
      }
      company.features = {
        accessToAnalytics: true,
        unlimitedJobPosting: true
      }
    }
    await company.save();
    return { company, message: "Comapny refited sucesssfully" };
  }
}
