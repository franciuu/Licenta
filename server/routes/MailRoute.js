import express from "express";
import { sendMail } from "../controllers/MailController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.post("/send-presence-mail", verifyRoles(ROLES_LIST[1]), sendMail);

export default router;
