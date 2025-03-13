import express from "express";
import { getActivityAttendances } from "../controllers/AttendancesController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/attendances/:id",
  verifyRoles(ROLES_LIST[1]),
  getActivityAttendances
);

export default router;
