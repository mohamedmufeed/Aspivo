import mongoose, { Schema, Types } from "mongoose";


export interface IReview{
    userId:Types.ObjectId;
    review:string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    review: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})
type ReviewDocumnet= IReview & Document
const Review= mongoose.model<ReviewDocumnet>("Review",ReviewSchema)
export  default Review