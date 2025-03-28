import express  from "express";
import { getUsers ,blockUser} from "../controllers/admin/userManagement.js";
import { approvedCompanies, getCompanies, handleCompanyRequest } from "../controllers/admin/comapnyMangement.js";
import { addSkill, getSkills } from "../controllers/admin/skillController.js";
const router= express.Router()
router.get("/admin-userManagement",getUsers)
router.patch("/block-user/:id",blockUser)
router.get("/companies",getCompanies)
router.post("/company-request",handleCompanyRequest)
router.get("/approved-company",approvedCompanies)
router.post("/add-skill",addSkill)
router.get("/get-skills",getSkills)

 export default router