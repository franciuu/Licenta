import express from "express";
import multer from "multer";
import { getRecognize } from "../controllers/AIController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();
const upload = multer();

router.post(
  "/rec",
  verifyRoles(ROLES_LIST[1]),
  upload.single("image"),
  getRecognize
);
export default router;
