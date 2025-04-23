import express from "express";
import {
  getActivityAttendances,
  getAttendanceTrendForActivity,
  getAttendancePercentageForLecture,
  getSeminarAttendancePercentageForCourse,
  getAttendanceCount,
} from "../controllers/AttendancesController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/attendances/trend/:id",
  verifyRoles(ROLES_LIST[1]),
  getAttendanceTrendForActivity
);
router.get(
  "/attendances/activity/:id",
  verifyRoles(ROLES_LIST[1]),
  getActivityAttendances
);
router.get(
  "/attendances/course/:id",
  verifyRoles(ROLES_LIST[1]),
  getAttendancePercentageForLecture
);
router.get(
  "/attendances/lectures/:id",
  verifyRoles(ROLES_LIST[1]),
  getSeminarAttendancePercentageForCourse
);
router.get(
  "/attendances/counts/:id",
  verifyRoles(ROLES_LIST[1]),
  getAttendanceCount
);

export default router;
