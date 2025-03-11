
import { register ,login, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/user/authController.js";
import { addEducation, addExprience, editAbout, editExperince, editProfile, getProfile , uploadResume} from "../controllers/user/profileController.js";
import express  from "express";
import {  Imageupload , resumeUplaod } from "../config/multer.js";

const router= express.Router()
router.post("/signup",register)
router.post("/login",login)
router.post("/otp-verification",verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)
router.put("/edit-profile/:id", Imageupload.single("profileImage"), editProfile);
router.get("/profile/:id",getProfile)
router.put("/edit-about/:id",editAbout)
router.post("/upload-resuem/:id",resumeUplaod.single("resume"),uploadResume)
router.post("/add-experience/:id",addExprience)
router.put("/edit-experience/:id",editExperince)
router.post("/add-education/:id",addEducation)


export default router