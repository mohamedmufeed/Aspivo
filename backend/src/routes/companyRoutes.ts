import express  from "express";
import { register } from "../controllers/company/companyauthcontroller.js";
import { fetchCompany ,fetchJob,postJob,editJob, deleteJob, getApplicantsForJob, getApplicantDetials, updateStatus} from "../controllers/company/companyJobController.js";
import { addTechStack, editCompanyDescription, editCompanyProfile, editContact, editTeam, getProfile } from "../controllers/company/companyProfileConstroller.js";



const router= express.Router()
router.post("/signup/:id",register)
router.get("/company/:id",fetchCompany)
router.post("/postjob/:id",postJob)
router.get("/jobs/:id",fetchJob)
router.put("/edit-job/:id",editJob)
router.delete("/delete-job/:id",deleteJob)
router.get("/jobapplicants/:id", getApplicantsForJob);
router.get("/jobapplicants/details/:id",getApplicantDetials)
router.patch("/update-status/:id",updateStatus)
router.get("/company-profile/:id",getProfile)
router.post("/edit-companyprofile/:id",editCompanyProfile)
router.post("/edit-comapnydescription/:id",editCompanyDescription)
router.post("/add-comapnytechstack/:id",addTechStack)
router.post("/edit-companyteam/:id",editTeam)
router.post("/edit-company-contact/:id",editContact)
export default router