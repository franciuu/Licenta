import express from "express";
import { handleRefreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();

router.get("/refresh", handleRefreshToken);

export default router;
