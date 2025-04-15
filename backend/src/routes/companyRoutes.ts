import express  from "express";
import { CompanyAuthController } from "../controllers/company/companyauthcontroller.js";
import {  CompanyJobController} from "../controllers/company/companyJobController.js";
import {  CompanyProfileController } from "../controllers/company/companyProfileConstroller.js";
import { CompanyRepostries } from "../repositories/companyRepositories.js";
import Job from "../models/job.js";
import Company from "../models/company.js";
import JobApplication from "../models/jobApplication.js";
import { CompanyAuthService } from "../services/compnyService/comanyauthservice.js";
import { ComapnayJobService } from "../services/compnyService/comapnyJobService.js";
import { CompanyProfileRepositiories } from "../repositories/companyProfileRepositories.js";
import { CompanyProfileService } from "../services/compnyService/companyProfileService.js";



const router= express.Router()


const companyRepository = new CompanyRepostries(Job,Company,JobApplication);
const companyAuthService = new CompanyAuthService(companyRepository);
const companyAuthController = new CompanyAuthController(companyAuthService);

const companyJobService = new ComapnayJobService(companyRepository);
const companyJobController = new CompanyJobController(companyJobService);

const companyRepo = new CompanyProfileRepositiories();
const companyService = new CompanyProfileService(companyRepo);
const companyProfileController = new CompanyProfileController(companyService);


// router.post("/signup/:id",companyAuthController.register)
// router.get("/company/:id",companyJobController.fetchCompany)
// router.post("/postjob/:id",companyJobController.postJob)
// router.get("/jobs/:id",companyJobController.fetchJob)
// router.put("/edit-job/:id",companyJobController.editJob)
// router.delete("/delete-job/:id",companyJobController.deleteJob)
// router.get("/jobapplicants/:id",companyJobController. getApplicantsForJob);
// router.get("/jobapplicants/details/:id",companyJobController.getApplicantDetails)
// router.patch("/update-status/:id",companyJobController.updateStatus)
// router.get("/company-profile/:id",companyProfileController.getProfile)
// router.put("/edit-companyprofile/:id",companyProfileController.editCompanyProfile)
// router.patch("/edit-comapnydescription/:id",companyProfileController.editCompanyDescription)
// router.put("/add-comapnytechstack/:id",companyProfileController.addTechStack)
// router.put("/edit-companyteam/:id",companyProfileController.editTeam)
// router.put("/edit-company-contact/:id",companyProfileController.editContact)





router.route("/auth/signup/:id").post(companyAuthController.register);


router
  .route("/profile/:id")
  .get(companyProfileController.getProfile)
  .put(companyProfileController.editCompanyProfile);

router
  .route("/profile/:id/description")
  .patch(companyProfileController.editCompanyDescription);

router
  .route("/profile/:id/techstack")
  .put(companyProfileController.addTechStack);

router
  .route("/profile/:id/team")
  .put(companyProfileController.editTeam);

router
  .route("/profile/:id/contact")
  .put(companyProfileController.editContact);


router.route("/").get(companyJobController.fetchCompany);

router
  .route("/jobs/:id")
  .get(companyJobController.fetchJob)
  .post(companyJobController.postJob);

router
  .route("/jobs/:id/edit")
  .put(companyJobController.editJob);

router
  .route("/jobs/:id/delete")
  .delete(companyJobController.deleteJob);

router
  .route("/jobs/:id/applicants")
  .get(companyJobController.getApplicantsForJob);

router
  .route("/jobs/applicants/:id/details")
  .get(companyJobController.getApplicantDetails);

router
  .route("/jobs/applicants/:id/status")
  .patch(companyJobController.updateStatus);

export default router