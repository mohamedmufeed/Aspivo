import express  from "express";
import { register } from "../controllers/company/companyauthcontroller.js";
import { fetchCompany ,fetchJob,postJob,editJob, deleteJob} from "../controllers/company/companyProfileController.js";



const router= express.Router()
router.post("/signup/:id",register)
router.get("/company/:id",fetchCompany)
router.post("/postjob/:id",postJob)
router.get("/jobs/:id",fetchJob)
router.put("/edit-job/:id",editJob)
router.delete("/delete-job/:id",deleteJob)
export default router