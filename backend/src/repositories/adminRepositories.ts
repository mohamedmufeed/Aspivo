import User from "../models/user.js";
import Company from "../models/company.js";
import {generateToken} from "../utils/jwt.js";
import mongoose from "mongoose";



export class AdminRepostry {
async getAllUsers(){
  return  await User.find()
}

async findById(id:string){
  return await  User.findById(id)
}
async findAllCompany(){
  return await Company.find()
}

}

