import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { ProfileSerive } from "../../services/profileService.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { json } from "stream/consumers";

const profileService = new ProfileSerive();

export const editProfile = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    const userId = req.params.id;
    const { firstName, lastName, phoneNumber, currentPostion, location } =
      req.body;

    let profileImage = "";

    if (req.file) {
      console.log("hrllo njna  ivade in")
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_image",
      });
      console.log(result.secure_url)
      profileImage = result.secure_url;
    }

    const data = {
      profileImage,
      firstName,
      lastName,
      phoneNumber,
      currentPostion,
      location,
    };

    const updatedProfile = await profileService.editProfile(userId, data);
    console.log(updatedProfile);
    return res
      .status(200)
      .json({ message: "User Profile updated scusessfully" });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await profileService.getProfile(userId);
    return res.status(200).json({ user, message: "User Found sucsess full" });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const editAbout = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { about } = req.body;
    const user = await profileService.editAbout(userId, about);
    return res.status(200).json({ user, message: "User About edited successfully" });

  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User About edited failed",
    });
  }
};


 export const uploadResume = async (req:Request,res:Response):Promise<any>=>{
  try {
    console.log(req.file)
   if (req.file) {
    console.log("file is done")
   }
    
return  res.status(200).json({message:"Resueme is good"})
  } catch (error) {
    return res.status(500).json({message:"Error in uplaoding resume"})
  }
 }