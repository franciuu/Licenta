import express from "express";
import { getCourses } from "../controllers/CourseController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/courses", verifyRoles(ROLES_LIST[0]), getCourses);

export default router;
