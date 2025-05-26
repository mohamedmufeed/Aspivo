import { REVIEW_CREATED_SUCCESSFULLY, REVIEW_FETCHED_SUCCESSFULLY, USER_NOT_FOUND } from "../constants/message";
import { IAuthRepository } from "../interface/repositories/userRepositories";
import IReviewService from "../interface/service/user/reviewServiceInterface";
import { IReview } from "../models/review";
import { AuthRepostry } from "../repositories/userRepositories";


export class ReviewService implements IReviewService {
    constructor(private readonly _authRepository: IAuthRepository) { }

    async addReview(userId: string, review: string): Promise<{ review: IReview, message: string }> {
        const user = await this._authRepository.findById(userId)
        if (!user) throw new Error(USER_NOT_FOUND)

        const reviewData = { userId: userId, review: review }
        const savedReview = await this._authRepository.addReview(reviewData)
        return { review: savedReview, message:REVIEW_CREATED_SUCCESSFULLY }

    }

    async getReview() {
        const review = await this._authRepository.getReview()
        return {review, message:REVIEW_FETCHED_SUCCESSFULLY}
    }
}