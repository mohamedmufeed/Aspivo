import {   ProfileTypes } from "../../../types/userTypes";
import { UserServiceResponse , SubscriptionHistoryResponse} from "../../../types/interfaceTypes";
import { Education, Experience } from "../../../models/user";


export default interface IProfileService {
editProfile(id:string,data:ProfileTypes):Promise<UserServiceResponse>
getProfile(id:string):Promise<UserServiceResponse>
editAbout(id:string,about:string):Promise<UserServiceResponse>
addExperience(id:string,data:Experience):Promise<UserServiceResponse>
editExperience(id:string, data:Experience, experienceId:string):Promise<UserServiceResponse>
addEducation(id:string,data:Education):Promise<UserServiceResponse>
editEducation(id:string,data:Education,educationId:string):Promise<UserServiceResponse>
addSkill(id:string,data:string[]):Promise<UserServiceResponse>
uploadResume(id:string,url:string):Promise<UserServiceResponse>
deleteResume(id:string):Promise<UserServiceResponse>
subscriptionHistory(userId:string):Promise<SubscriptionHistoryResponse>
generateResumeFromProfile(userId:string):Promise<{response:string|undefined, message:string}>
textFormating(text:string,propmtKey:string, userId:string):Promise<{response:string|undefined, message:string}>
}