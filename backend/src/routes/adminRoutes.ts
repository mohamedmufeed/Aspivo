import express  from "express";
import { getUsers ,blockUser} from "../controllers/admin/userManagement.js";
const router= express.Router()
router.get("/admin-userManagement",getUsers)
router.patch("/block-user/:id",blockUser)


 export default router