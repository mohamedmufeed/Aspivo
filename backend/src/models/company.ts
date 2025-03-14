
import mongoose, { Schema } from "mongoose";

const comapnySchema =new Schema({
    comapnyName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:false
    },
    desciption:{
        type:String,
        required:false
    },
    companyUrl:{
        type:String,
        required:false
    },
    logo:{
        type:String,
        required:false
    },
    kyc:{
        type:String,
        required:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    verified:{
        type:Boolean,
        required:false
    },
    stack:[
        {
            type:String,
            required:false,
            trim:true
        }
    ],
    startDate:{
        type:Date,
        required:false
    },
    industry:{
        type:String,
        required:false
    },
    contact:[
        {
            type:String,
            logo:String,
            required:false

        }
    ],
    employees:{
        type:Number,
        required:false
    }
    
})

 const Company=mongoose.model("Company",comapnySchema)
 export default Company;