import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { ProfileSerive } from "../../services/profileService.js";
import cloudinary from "../../config/cloudinaryConfig.js";


const profileSerive = new ProfileSerive()

export const editProfile = async (req: Request, res: Response): Promise<any> => {
    console.log("hello")
  
    try {
  
      const userId = req.params.id ;
      const {firstName,lastName,phoneNumber,currentPostion,location} = req.body;
     

      let profileImage=""
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "profile_image" });
        profileImage = result.secure_url; 
      }
  
      const data = {
         profileImage,firstName,lastName,phoneNumber,currentPostion,location,
      };

      const updatedProfile = await profileSerive.editProfile(userId, data);
      console.log(updatedProfile)
      return res.status(200).json({message:"User Profile updated scusessfully"})
    } catch (error) {
      return res
      .status(400)
      .json({
        error: error instanceof Error ? error.message : "User profile updated  failed",
      });
    }
  };


  export const getProfile= async(req:Request,res:Response):Promise<any>=>{
    try {
      const userId=req.params.id
    const user = await profileSerive.getProfile(userId)
    return res.status(200).json({ user ,message:"User Found sucsess full"})
      
    } catch (error) {
      return res
      .status(400)
      .json({
        error: error instanceof Error ? error.message : "User profile updated  failed",
      });
    }
  }