
import { AuthController } from "../controllers/user/authController";
import {  ProfileController} from "../controllers/user/profileController";
import {  NotificationController } from "../controllers/user/notificationController";
import express  from "express";
import {  Imageupload } from "../config/multer";
import protect from "../middleware/authMiddlwware";
import passport from "passport";
import { JobController } from "../controllers/user/jobcontroller";
import { AuthService } from "../services/authService";
import { AuthRepostry } from "../repositories/userRepositories";
import { JobRepositories } from "../repositories/jobRepositories";
import { JobService } from "../services/jobService";
import { NotificationService } from "../services/notificationService";
import { ProfileService } from "../services/profileService";
import { SkillRepository } from "../repositories/skillREpositories";
import { NotificationRepository } from "../repositories/notificationRepository";
import { ReviewController } from "../controllers/user/reviewController";
import { ReviewService } from "../services/reviewService";


const router= express.Router()

const authRepostry= new AuthRepostry();
const authService = new AuthService(authRepostry);
const authController = new AuthController(authService);

const jobRepositories = new JobRepositories();
const jobService = new JobService(jobRepositories, authRepostry);
const jobController = new JobController(jobService);

const notificationRepository= new NotificationRepository()
const notificationService= new NotificationService(notificationRepository)
const notificationController = new NotificationController(notificationService);

const skillRepostry= new SkillRepository()
const profileService=new ProfileService(authRepostry,skillRepostry)
const profileController = new ProfileController(profileService);

const reviewService = new ReviewService(authRepostry)
const reviewController= new ReviewController(reviewService)

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
  .put(protect,profileController.editAbout);

router
  .route("/users/:id/resume")
  .post(protect,profileController.uploadResume)
  .delete(protect, profileController.deleteResume);

router
  .route("/users/:id/experience")
  .post(protect,profileController.addExperience)
  .put(protect,profileController.editExperience);

router
  .route("/users/:id/education")
  .post(protect,profileController.addEducation)
  .put(protect,profileController.editEducation);

router
  .route("/users/:id/skills")
  .post(protect,profileController.addSkill)
  .patch()
  

router
  .route("/users/:id/subscription-history")
  .get(protect,profileController.subscriptionHistory);

  router
  .route("/users/:id/resume/auto-generate")
  .get(protect,profileController.generateResumeFromProfile)

  router
  .route("/users/:id/text-format")
  .post(protect,profileController.textFormating)
router
  .route("/users/:id/notifications")
  .get(protect, notificationController.getNotifications)
  .patch(protect, notificationController.isRead);

 


router
  .route("/jobs")
  .get(jobController.fetchJob);

router
  .route("/jobs/:id")
  .get(protect,jobController.getJobDetails);

router
  .route("/jobs/:id/apply")
  .post(protect, jobController.applyForJob);

router
  .route("/jobs/:id/is-applied")
  .get(jobController.isApplied);

router
  .route("/users/:id/applied-jobs")
  .get(protect, jobController.appliedJobs);

  router
  .route("/users/:id/save-job")
  .post(jobController.saveJob)

router 
.route("/users/:id/saved-jobs")
.get(jobController.savedJobs)

router
.route("/users/:id/saved-jobsdata")
.get(jobController.populatedSavedJobs)

router
.route("/users/:id/add-review")
.post(reviewController.addReview)
.get(reviewController.getReview)

router
.route("/users/get-review")
.get(reviewController.getReview)



router
.route("/latest-jobs")
.get(jobController.latestJobs)

export default router