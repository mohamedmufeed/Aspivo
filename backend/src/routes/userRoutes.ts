
import { AuthController } from "../controllers/user/authController";
import {  ProfileController} from "../controllers/user/profileController";
import {  NotificationController } from "../controllers/user/notificationController";
import express  from "express";
import {  Imageupload } from "../config/multer";
import protect from "../middleware/authMiddlwware";
import passport from "passport";
import { JobController } from "../controllers/user/jobcontroller";
import { createCheckoutSession } from "../controllers/user/stripeController";
import { AuthService } from "../services/authService";
import { AuthRepostry } from "../repositories/userRepositories";
import { JobRepositories } from "../repositories/jobRepositories";
import { JobService } from "../services/jobService";
import { NotificationRepository } from "../repositories/notificationRepository";
import { NotificationService } from "../services/notificationService";
import { ProfileService } from "../services/profileService";
import { SkillRepository } from "../repositories/skillREpositories";


const router= express.Router()

const authRepostry= new AuthRepostry()
const authService = new AuthService(authRepostry);
const authController = new AuthController(authService);

const jobRepositories = new JobRepositories();
const jobService = new JobService(jobRepositories);
const jobController = new JobController(jobService);

const notificationService= new NotificationService()
const notificationController = new NotificationController(notificationService);

const skillRepostry= new SkillRepository()
const profileService=new ProfileService(authRepostry,skillRepostry)
const profileController = new ProfileController(profileService);


// router.post("/signup",authController.register)
// router.post("/login",authController.login)
// router.post("/otp-verification",authController.verifyOtp)
// router.post("/resend-otp",authController.resendOtp)
// router.post("/forgot-password",authController.forgotPassword)
// router.post("/reset-password",authController.resetPassword)
// router.put("/edit-profile/:id", Imageupload.single("profileImage"), profileController.editProfile);
// router.get("/profile/:id",protect,profileController.getProfile)
// router.post("/logout/:id",authController.logout);
// router.put("/edit-about/:id",profileController.editAbout)
// router.post("/upload-resume/:id",profileController.uploadResume)
// router.post("/add-experience/:id",profileController.addExperience)
// router.put("/edit-experience/:id",profileController.editExperience)
// router.post("/add-education/:id",profileController.addEducation)
// router.put("/edit-education/:id",profileController.editEducation)
// router.post("/add-skill/:id",profileController.addSkill)
// router.post("/refresh",authController.refreshToken)

// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/google/callback", passport.authenticate("google"), authController.googleCallBack);
// router.get("/google/success", authController.getGoogleUser);

// router.delete("/delete-resume/:id",protect,profileController.deleteResume)
// router.get("/notifications/:id",protect,notificationController.getNotifications)
// router.patch("/markas-read/:id",protect,notificationController.isRead)
// router.get("/jobs",jobController.fetchJob)
// router.get("/job-details/:id",jobController.getJobDetails)
// router.post("/applyjob/:id",protect,jobController.applyForJob)
// router.get("/applyed-jobs/:id",protect,jobController.appliedJobs)
// router.get("/is-applied/:id",jobController.isApplied)
// router.get("/subscription-history/:id",profileController.subscriptionHistory)




router
  .route("/auth/signup")
  .post(authController.register);

router
  .route("/auth/login")
  .post(authController.login);

router
  .route("/auth/otp-verification")
  .post(authController.verifyOtp);

router
  .route("/auth/resend-otp")
  .post(authController.resendOtp);

router
  .route("/auth/forgot-password")
  .post(authController.forgotPassword);

router
  .route("/auth/reset-password")
  .post(authController.resetPassword);

router
  .route("/auth/logout/:id")
  .post(authController.logout);


router
  .route("/refresh")
  .post(authController.refreshToken);



router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google"), authController.googleCallBack);
router.get("/google/success", authController.getGoogleUser);



router
  .route("/users/:id/profile")
  .get(protect, profileController.getProfile)
  .put(Imageupload.single("profileImage"), profileController.editProfile);

router
  .route("/users/:id/about")
  .put(profileController.editAbout);

router
  .route("/users/:id/resume")
  .post(profileController.uploadResume)
  .delete(protect, profileController.deleteResume);

router
  .route("/users/:id/experience")
  .post(profileController.addExperience)
  .put(profileController.editExperience);

router
  .route("/users/:id/education")
  .post(profileController.addEducation)
  .put(profileController.editEducation);

router
  .route("/users/:id/skills")
  .post(profileController.addSkill);

router
  .route("/users/:id/subscription-history")
  .get(protect,profileController.subscriptionHistory);


router
  .route("/users/:id/notifications")
  .get(protect, notificationController.getNotifications)
  .patch(protect, notificationController.isRead);


router
  .route("/jobs")
  .get(jobController.fetchJob);

router
  .route("/jobs/:id")
  .get(jobController.getJobDetails);

router
  .route("/jobs/:id/apply")
  .post(protect, jobController.applyForJob);

router
  .route("/jobs/:id/is-applied")
  .get(jobController.isApplied);

router
  .route("/users/:id/applied-jobs")
  .get(protect, jobController.appliedJobs);





export default router