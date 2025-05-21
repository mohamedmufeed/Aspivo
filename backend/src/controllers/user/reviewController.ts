import { Request, Response } from "express";
import { IReviewController } from "../../interface/controller/user/reviewControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/error";
import { ReviewService } from "../../services/reviewService";
import IReviewService from "../../interface/service/user/reviewServiceInterface";

export class ReviewController implements IReviewController {
    constructor(private _reviewService: IReviewService) { }

    public addReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id
            const { review } = req.body
            const response = await this._reviewService.addReview(userId, review)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message })
        }
    }
    public getReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this._reviewService.getReview()
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message})
        }
    }
}