import express from "express";
import {
  getStudents,
  getStudentById,
  getStudentByEmail,
  createStudent,
  deleteStudent,
  updateStudent,
  getPersonalStudents,
  getActivityStudents,
} from "../controllers/StudentsController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/students", verifyRoles(ROLES_LIST[0], ROLES_LIST[1]), getStudents);
router.get(
  "/personal/students",
  verifyRoles(ROLES_LIST[1]),
  getPersonalStudents
);
router.get("/students/search", verifyRoles(ROLES_LIST[0]), getStudentByEmail);
router.post("/students", verifyRoles(ROLES_LIST[0]), createStudent);
router.get(
  "/students/activity/:id",
  verifyRoles(ROLES_LIST[1]),
  getActivityStudents
);
router.get(
  "/students/:id",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  getStudentById
);
router.put("/students/:id", verifyRoles(ROLES_LIST[0]), updateStudent);
router.delete("/students/:id", verifyRoles(ROLES_LIST[0]), deleteStudent);

export default router;
