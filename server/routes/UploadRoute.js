import express from "express";
import { generateSignedUrl, uploadFiles } from "../controllers/CloudinaryController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get(
  "/cloudinary-signature",
  verifyRoles(ROLES_LIST[0]),
  generateSignedUrl
);

router.post(
  "/upload",
  verifyRoles(ROLES_LIST[0]),
  uploadFiles
);

export default router;
