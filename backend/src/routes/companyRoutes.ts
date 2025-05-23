import express from "express";
import { CompanyAuthController } from "../controllers/company/companyauthcontroller";
import { CompanyJobController } from "../controllers/company/companyJobController";
import { CompanyProfileController } from "../controllers/company/companyProfileConstroller";
import { CompanyRepostries } from "../repositories/companyRepositories";
import Job from "../models/job";
import Company from "../models/company";
import JobApplication from "../models/jobApplication";
import { CompanyAuthService } from "../services/compnyService/comanyauthservice";
import { ComapnayJobService } from "../services/compnyService/comapnyJobService";
import { CompanyProfileRepositiories } from "../repositories/companyProfileRepositories";
import { CompanyProfileService } from "../services/compnyService/companyProfileService";
import { CompanyMeetingRepositories } from "../repositories/coampanyMeetingRepositories";
import { CompanyMeetingService } from "../services/compnyService/companyMeetingService";
import { NotificationRepository } from "../repositories/notificationRepository";
import { NotificationService } from "../services/notificationService";
import { ComapnyMeetingController } from "../controllers/company/companyMeetingController";
import { CompanyDasboradController } from "../controllers/company/companyDasboardController";
import { CompanyDasboradService } from "../services/compnyService/companyDasboardService";
import { ComapnyDasboardRepositories } from "../repositories/companyDasboardRespostries";
import User from "../models/user";
import protect from "../middleware/authMiddlwware";



const router = express.Router()


const companyRepository = new CompanyRepostries(Job, Company, JobApplication, User);
const companyAuthService = new CompanyAuthService(companyRepository);
const companyAuthController = new CompanyAuthController(companyAuthService);
const notificationRepository = new NotificationRepository()
const companyJobService = new ComapnayJobService(companyRepository, notificationRepository);
const companyJobController = new CompanyJobController(companyJobService);

const companyRepo = new CompanyProfileRepositiories();
const companyService = new CompanyProfileService(companyRepo);
const companyProfileController = new CompanyProfileController(companyService);


const notificationService = new NotificationService(notificationRepository)
const meetingRepository = new CompanyMeetingRepositories()
const meetingService = new CompanyMeetingService(meetingRepository, notificationService)
const meetingController = new ComapnyMeetingController(meetingService)

const companyDasboardRepository = new ComapnyDasboardRepositories()
const companyDasboardService = new CompanyDasboradService(companyDasboardRepository)
const companyDashboardController = new CompanyDasboradController(companyDasboardService)

router.route("/auth/signup/:id").post(companyAuthController.register);


router
  .route("/profile/:id")
  .all(protect)
  .get(companyProfileController.getProfile)
  .put(companyProfileController.editCompanyProfile);

router
  .route("/profile/:id/description")
  .all(protect)
  .patch(companyProfileController.editCompanyDescription);

router
  .route("/profile/:id/techstack")
  .all(protect)
  .put(companyProfileController.addTechStack);

router
  .route("/profile/:id/team")
  .all(protect)
  .put(companyProfileController.editTeam);

router
  .route("/profile/:id/contact")
  .all(protect)
  .put(companyProfileController.editContact);


router.route("/")
  .all(protect)
  .get(companyJobController.fetchCompany);

router
  .route("/jobs/:id")
  .all(protect)
  .get(companyJobController.fetchJob)
  .post(companyJobController.postJob);

router
  .route("/jobs/:id/edit")
  .all(protect)
  .put(companyJobController.editJob);

router
  .route("/jobs/:id/delete")
  .all(protect)
  .patch(companyJobController.chageJobStatus);

router
  .route("/jobs/:id/applicants")
  .all(protect)
  .get(companyJobController.getApplicantsForJob);

router
  .route("/jobs/applicants/:id/details")
  .all(protect)
  .get(companyJobController.getApplicantDetails);

router
  .route("/jobs/applicants/:id/status")
  .all(protect)
  .patch(companyJobController.updateStatus);

router
  .route("/meetings")
  .all(protect)
  .post(meetingController.sheduleMeeting)

router.route("/meetings/:id")
  .all(protect)
  .get(meetingController.getMeetings)



router
  .route("/dashboard-status/:id")
  .all(protect)
  .get(companyDashboardController.getDashboardStatus.bind(companyDashboardController))

router
  .route("/dashboard/application-status/:id")
  .all(protect)
  .get(companyDashboardController.getApplicationStatusByDate.bind(companyDashboardController))

router
  .route("/dashboard/most-appliedjobs/:id")
  .all(protect)
  .get(companyDashboardController.getMostAppliedJobs.bind(companyDashboardController))

export default router