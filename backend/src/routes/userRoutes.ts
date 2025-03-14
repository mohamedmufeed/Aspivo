
import { register ,login, verifyOtp, resendOtp, forgotPassword, resetPassword, refreshToken, googleCallBack, getGoogleUser } from "../controllers/user/authController.js";
import { addEducation, addExprience, addSkill, deleteResume, editAbout, editEducation, editExperince, editProfile, getProfile , uploadResume} from "../controllers/user/profileController.js";
import express  from "express";
import {  Imageupload , resumeUplaod } from "../config/multer.js";
import protect from "../middleware/authMiddlwware.js";
import passport from "passport";

const router= express.Router()
router.post("/signup",register)
router.post("/login",login)
router.post("/otp-verification",verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)
router.put("/edit-profile/:id", Imageupload.single("profileImage"), editProfile);
router.get("/profile/:id",protect,getProfile)
router.put("/edit-about/:id",editAbout)
router.post("/upload-resume/:id",uploadResume)
router.post("/add-experience/:id",addExprience)
router.put("/edit-experience/:id",editExperince)
router.post("/add-education/:id",addEducation)
router.put("/edit-education/:id",editEducation)
router.post("/add-skill/:id",addSkill)
router.post("/refresh",refreshToken)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { session: false }),googleCallBack);
router.get("/google/success", getGoogleUser);
router.delete("/delete-resume/:id",deleteResume)



export default router