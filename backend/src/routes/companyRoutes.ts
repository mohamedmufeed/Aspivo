import express  from "express";
import { register } from "../controllers/company/companyauthcontroller.js";
import { fetchCompany ,fetchJob,postJob} from "../controllers/company/companyProfileController.js";



const router= express.Router()
router.post("/signup/:id",register)
router.get("/company/:id",fetchCompany)
router.post("/postjob/:id",postJob)
router.get("/jobs/:id",fetchJob)
export default router