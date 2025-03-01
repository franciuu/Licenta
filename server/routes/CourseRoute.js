import express from "express";
import { getCourses, createCourse } from "../controllers/CourseController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/courses", verifyRoles(ROLES_LIST[0]), getCourses);
router.post("/courses", verifyRoles(ROLES_LIST[0]), createCourse);

export default router;
