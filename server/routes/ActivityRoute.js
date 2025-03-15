import express from "express";
import {
  getCourseActivities,
  createActivity,
  getPersonalActivities,
  getActivityById,
} from "../controllers/ActivitiesController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/activities/personal",
  verifyRoles(ROLES_LIST[1]),
  getPersonalActivities
);
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

export default router;
