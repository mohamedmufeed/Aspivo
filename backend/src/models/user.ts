
import mongoose ,{Schema} from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified:{
        type:Boolean,
        default:false
    },
    
    profileImage:{
        type:String,
        default:''
    },
    otp:{
        type:String
    },
    otpExpires:{
        type:Date
    }
}, {
    timestamps: true
});

const User= mongoose.model("User",userSchema)
export default User