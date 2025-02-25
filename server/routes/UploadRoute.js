import express from "express";
import { generateSignedUrl } from "../controllers/CloudinaryController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/cloudinary-signature",
  verifyRoles(ROLES_LIST[0]),
  generateSignedUrl
);

export default router;
