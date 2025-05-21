import { ICompany } from "../../models/company";
import { ISubscription } from "../../models/Subscription";
import { IUser } from "../../models/user";
import { IMappedUserDto, IMppaedCompany } from "../../types/userTypes";

export const mappedUsers = (user: IUser):IMappedUserDto => {
    return {
        _id: user._id.toString(),
        profileImage: user.profileImage,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        isBlocked: user.isBlocked
    }
}

export const mappedCompanies= (company:ICompany):IMppaedCompany=>{
    return {
        _id:company._id.toString(),
        companyName:company.companyName,
        email:company.email,
        status:company.status,
        createdAt:company.createdAt.toISOString(),
        kyc:company.kyc,
        isBlocked:company.isBlocked

    }
}

 export  const  mapppedSubscription=(susbcription:ISubscription)=>{
    return{
        _id:susbcription._id,
        firstName:susbcription.userId
    }
 }