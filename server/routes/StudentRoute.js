import express from "express";
import { getStudents } from "../controllers/StudentsController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/students", verifyRoles(ROLES_LIST[0], ROLES_LIST[1]), getStudents);

export default router;
