import express  from "express";
import {  UserManagementController} from "../controllers/admin/userManagement";
import { AdminController } from "../controllers/admin/comapnyMangement";
import {  SkillController } from "../controllers/admin/skillController";
import {  SubscriptionController } from "../controllers/admin/subscriptionController";
import Company from "../models/company";
import User from "../models/user";
import Skill from "../models/skills";
import Subscription from "../models/Subscription";
import { AdminRepostry } from "../repositories/adminRepositories";
import { AdminService } from "../services/adminService/adminService";
import { SkillRepository } from "../repositories/skillREpositories";
import { SkillService } from "../services/adminService/skillService";
import { SubscriptionService } from "../services/adminService/subscriptionService";
import protect from "../middleware/authMiddlwware";
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
  .get("/users",protect,userController.getUsers)              
  .patch("/users/:id/block", userController.blockUser); 


router
  .get("/companies",protect, adminController.getCompanies)               
  .get("/companies/approved",protect, adminController.approvedCompanies) 
  .post("/companies/requests", adminController.handleCompanyRequest);


router
  .post("/skills", skillController.addSkill)           
  .get("/skills", protect,skillController.getSkills)            
  .delete("/skills/:id", skillController.removeSkill); 


router
  .get("/subscriptions", protect,subscriptionController.getSubscriptions)          
  .patch("/subscriptions/:id/status", subscriptionController.updateSubscriptionStatus);

 export default router

