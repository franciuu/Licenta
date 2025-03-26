import express from "express";
import {
  getCourses,
  createCourse,
  getCourseById,
  deleteCourse,
} from "../controllers/CourseController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/courses", verifyRoles(ROLES_LIST[0], ROLES_LIST[1]), getCourses);
router.post("/courses", verifyRoles(ROLES_LIST[0]), createCourse);
router.get("/courses/:id", verifyRoles(ROLES_LIST[0]), getCourseById);
router.delete("/courses/:id", verifyRoles(ROLES_LIST[0]), deleteCourse);

export default router;
