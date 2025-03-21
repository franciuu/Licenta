import express from "express";
import {
  createAcademicYear,
  createSemester,
  getAcademicYears,
} from "../controllers/AcademicYearController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();
router.get("/academic-years", verifyRoles(ROLES_LIST[0]), getAcademicYears);
router.post("/academic-years", verifyRoles(ROLES_LIST[0]), createAcademicYear);
router.post("/semesters", verifyRoles(ROLES_LIST[0]), createSemester);

export default router;
