import cloudinary from "./cloudinaryConfig.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile_image",
      format: "png",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});


const upload = multer({
  storage: storage
});

export {upload}