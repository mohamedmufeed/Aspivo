
import { register ,login, verifyOtp, resendOtp, forgotPassword, resetPassword, refreshToken, googleCallBack, getGoogleUser } from "../controllers/user/authController.js";
import { addEducation, addExprience, addSkill, deleteResume, editAbout, editEducation, editExperince, editProfile, getProfile , uploadResume} from "../controllers/user/profileController.js";
import { getNotifications, isRead } from "../controllers/user/notificationController.js";
import express  from "express";
import {  Imageupload , resumeUplaod } from "../config/multer.js";
import protect from "../middleware/authMiddlwware.js";
import passport from "passport";
import { appliedjobs, applyForJob, fetchJob, getJobDetails } from "../controllers/user/jobcontroller.js";

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
router.get("/google/callback", passport.authenticate("google"), googleCallBack);
router.get("/google/success", getGoogleUser);
router.delete("/delete-resume/:id",deleteResume)
router.get("/notifications/:id",getNotifications)
router.patch("/markas-read/:id",isRead)
router.get("/jobs",fetchJob)
router.get("/job-details/:id",getJobDetails)
router.post("/applyjob/:id",applyForJob)
router.get("/applyed-jobs/:id",appliedjobs)


export default router