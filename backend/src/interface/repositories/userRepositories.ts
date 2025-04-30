
import { HydratedDocument } from "mongoose";
import {IUser, UserDocument} from "../../models/user"
import {SubscriptionDocument} from "../../models/Subscription"
import { IReviewData } from "../../types/userTypes";
import { ReviewDocumnet } from "../../models/review";
export interface IAuthRepository {
  register(
    userName: string,
    email: string,
    hashedOtp: string,
    otpExpires: Date,
    hashePassword: string
  ): Promise<{
    user: HydratedDocument<UserDocument>;
    token: string;
    refreshToken: string;
  }>;

  findByEmail(email: string): Promise<HydratedDocument<UserDocument> | null>;
  findById(id: string): Promise<HydratedDocument<UserDocument> | null>;
  findSubscriptions(userId: string): Promise<HydratedDocument<SubscriptionDocument>[]>;
  findbyIdAndUpdate(id: string, data: Partial<IUser>): Promise<HydratedDocument<UserDocument> | null>;
  addReview(reviewData:IReviewData):Promise <ReviewDocumnet>
}
