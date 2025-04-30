import IReviewService from "../interface/service/user/reviewServiceInterface";
import { IReview } from "../models/review";
import { AuthRepostry } from "../repositories/userRepositories";


export class ReviewService implements IReviewService {
    constructor(private readonly _authRepository: AuthRepostry) { }

    async addReview(userId: string, review: string): Promise<{ review: IReview, message: string }> {
        const user = await this._authRepository.findById(userId)
        if (!user) throw new Error("User not found")

        const reviewData = { userId: userId, review: review }
        const savedReview = await this._authRepository.addReview(reviewData)
        return { review: savedReview, message: "Review created sucessfull" }

    }

    async getReview() {
        const review = await this._authRepository.getReview()
        return {review, message: "Review fetched sucssessfully"}
    }
}