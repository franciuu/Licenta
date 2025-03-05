import express from "express";
import {
  getCourses,
  createCourse,
  getCourseById,
} from "../controllers/CourseController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/courses", verifyRoles(ROLES_LIST[0]), getCourses);
router.get("/courses/:id", verifyRoles(ROLES_LIST[0]), getCourseById);
router.post("/courses", verifyRoles(ROLES_LIST[0]), createCourse);

export default router;
