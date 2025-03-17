import express  from "express";
import { register } from "../controllers/company/companyauthcontroller.js";
import { fetchCompany } from "../controllers/company/companyProfileController.js";



const router= express.Router()
router.post("/signup/:id",register)
router.get("/company/:id",fetchCompany)
export default router