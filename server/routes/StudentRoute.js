import express from "express";
import {
  getStudents,
  getStudentById,
} from "../controllers/StudentsController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/students", verifyRoles(ROLES_LIST[0], ROLES_LIST[1]), getStudents);
router.get(
  "/student/:id",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  getStudentById
);

export default router;
