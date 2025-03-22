import express  from "express";
import { register } from "../controllers/company/companyauthcontroller.js";
import { fetchCompany ,fetchJob,postJob,editJob, deleteJob, getApplicantsForJob} from "../controllers/company/companyJobController.js";



const router= express.Router()
router.post("/signup/:id",register)
router.get("/company/:id",fetchCompany)
router.post("/postjob/:id",postJob)
router.get("/jobs/:id",fetchJob)
router.put("/edit-job/:id",editJob)
router.delete("/delete-job/:id",deleteJob)
router.get("/jobapplicants/:id", getApplicantsForJob);
export default router