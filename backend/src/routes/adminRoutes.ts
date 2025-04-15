import express  from "express";
import {  UserManagementController} from "../controllers/admin/userManagement.js";
import { AdminController } from "../controllers/admin/comapnyMangement.js";
import {  SkillController } from "../controllers/admin/skillController.js";
import {  SubscriptionController } from "../controllers/admin/subscriptionController.js";
import Company from "../models/company.js";
import User from "../models/user.js";
import Skill from "../models/skills.js";
import Subscription from "../models/Subscription.js";
import { AdminRepostry } from "../repositories/adminRepositories.js";
import { AdminService } from "../services/adminService/adminService.js";
import { SkillRepository } from "../repositories/skillREpositories.js";
import { SkillService } from "../services/adminService/skillService.js";
import { SubscriptionService } from "../services/adminService/subscriptionService.js";
const router= express.Router()


const adminRepository = new AdminRepostry(User,Company,Subscription);
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);


const skillRepository = new SkillRepository(); 
const skillService = new SkillService(skillRepository);
const skillController = new SkillController(skillService);


const subscriptionService = new SubscriptionService(adminRepository);
const subscriptionController = new SubscriptionController(subscriptionService);


const userController = new UserManagementController(adminService,adminRepository);

// router.get("/admin-userManagement",userController.getUsers)
// router.patch("/block-user/:id",userController.blockUser)
// router.get("/companies",adminController.getCompanies)
// router.post("/company-request",adminController.handleCompanyRequest)
// router.get("/approved-company",adminController.approvedCompanies)
// router.post("/add-skill",skillController.addSkill)
// router.get("/get-skills",skillController.getSkills)
// router.delete("/remove-skill/:id",skillController.removeSkill)
// router.get("/subscriptions",subscriptionController.getSubscriptions)
// router.patch("/update-subscriptionstatus/:id",subscriptionController.updateSubscriptionStatus)


router
  .get("/users", userController.getUsers)              
  .patch("/users/:id/block", userController.blockUser); 


router
  .get("/companies", adminController.getCompanies)               
  .get("/companies/approved", adminController.approvedCompanies) 
  .post("/companies/requests", adminController.handleCompanyRequest);


router
  .post("/skills", skillController.addSkill)           
  .get("/skills", skillController.getSkills)            
  .delete("/skills/:id", skillController.removeSkill); 


router
  .get("/subscriptions", subscriptionController.getSubscriptions)          
  .patch("/subscriptions/:id/status", subscriptionController.updateSubscriptionStatus);

 export default router

