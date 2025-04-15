import { Education, Experience, ProfileTypes } from "../../../types/userTypes";
import { UserServiceResponse ,SubscriptionResponse} from "../../../types/interfaceTypes";

export default interface IProfileService {
editProfile(id:string,data:ProfileTypes):UserServiceResponse
getProfile(id:string):UserServiceResponse
editAbout(id:string,about:string):UserServiceResponse
addExperience(id:string,data:Experience):UserServiceResponse
editExperience(id:string, data:Experience, experienceId:string):UserServiceResponse
addEducation(id:string,data:Education):UserServiceResponse
editEducation(id:string,data:Education,educationId:string):UserServiceResponse
addSkill(id:string,data:string[]):UserServiceResponse
uploadResume(id:string,url:string):UserServiceResponse
deleteResume(id:string):UserServiceResponse
subscriptionHistory(id:string):SubscriptionResponse
}