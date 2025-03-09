
import { register ,login, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/user/authController.js";
import { editProfile, getProfile } from "../controllers/user/profileController.js";
import express  from "express";
import { upload } from "../config/multer.js";

const router= express.Router()
router.post("/signup",register)
router.post("/login",login)
router.post("/otp-verification",verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)
router.put("/edit-profile/:id", upload.single("profileImage"), editProfile);
router.get("/profile/:id",getProfile)


export default router