import express from "express";
import { createEnrollment } from "../controllers/EnrollmentController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.post("/enrollments", verifyRoles(ROLES_LIST[0]), createEnrollment);

export default router;
