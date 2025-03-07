
import { register ,login, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/user/authController.js";
import express  from "express";

const router= express.Router()
router.post("/signup",register)
router.post("/login",login)
router.post("/otp-verification",verifyOtp)
router.post("/resend-otp",resendOtp)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)


export default router