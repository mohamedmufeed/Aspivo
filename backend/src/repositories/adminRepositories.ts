import User from "../models/user.js";
import generateToken from "../utils/jwt.js";
import mongoose from "mongoose";



export class AdminRepostry {
async getAllUsers(){
  return  await User.find()
}

async findById(id:string){
  return await  User.findById(id)
}
}

