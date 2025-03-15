import express from "express";
import {
  createEnrollment,
  getActivityEnrollments,
} from "../controllers/EnrollmentController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.post("/enrollments", verifyRoles(ROLES_LIST[0]), createEnrollment);
router.get(
  "/enrollments/:idActivity",
  verifyRoles(ROLES_LIST[0]),
  getActivityEnrollments
);

export default router;
