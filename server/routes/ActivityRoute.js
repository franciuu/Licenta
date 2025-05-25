import express from "express";
import {
  getCourseActivities,
  createActivity,
  getPersonalActivities,
  getPersonalActivitiesCount,
  getActivityById,
  getLectures,
  deleteActivity,
} from "../controllers/ActivitiesController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/activities/personal",
  verifyRoles(ROLES_LIST[1]),
  getPersonalActivities
);
router.get(
  "/activities/personal/count",
  verifyRoles(ROLES_LIST[1]),
  getPersonalActivitiesCount
);
router.get("/activities/lectures", verifyRoles(ROLES_LIST[1]), getLectures);
router.post("/activities", verifyRoles(ROLES_LIST[0]), createActivity);
router.get(
  "/activities/course/:id",
  verifyRoles(ROLES_LIST[0]),
  getCourseActivities
);
router.get(
  "/activities/:id",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  getActivityById
);
router.delete("/activities/:id", verifyRoles(ROLES_LIST[0]), deleteActivity);

export default router;
