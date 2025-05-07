import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => {
    return {
      folder: "profile_image",
      format: "png",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "resumes",
      resource_type: "auto",
      format: file.mimetype.split("/")[1],
    };
  },
});

const Imageupload = multer({ storage });
const resumeUplaod = multer({ storage: resumeStorage }); 

export { Imageupload, resumeUplaod };
