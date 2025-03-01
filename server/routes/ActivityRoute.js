import express from "express";
import { getActivities } from "../controllers/ActivitiesController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/activities",
  verifyRoles(ROLES_LIST[0], ROLES_LIST[1]),
  getActivities
);

export default router;
