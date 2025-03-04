import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
} from "../controllers/StudentsController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/students", verifyRoles(ROLES_LIST[0], ROLES_LIST[1]), getStudents);
router.get(
  "/students/:id",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  getStudentById
);
router.post("/students", verifyRoles(ROLES_LIST[0]), createStudent);
router.put(
  "/students/:id",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  updateStudent
);
router.delete("/students/:id", verifyRoles(ROLES_LIST[0]), deleteStudent);

export default router;
