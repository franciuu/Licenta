import express from "express";
import { requestReset, resetPasswordController } from "../controllers/PasswordResetController.js";

const router = express.Router();

router.post("/request", requestReset);
router.post("/reset", resetPasswordController);

export default router; 