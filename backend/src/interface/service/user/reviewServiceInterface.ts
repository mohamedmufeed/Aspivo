import { IReview } from "../../../models/review"

export default interface IReviewService{
    addReview(userId:string,review:string):Promise<{review:IReview, message:string}>
}