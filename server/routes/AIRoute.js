import express from "express";
import { processAI } from "../controllers/AIController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/ai", verifyRoles(ROLES_LIST[1]), processAI);
export default router;
