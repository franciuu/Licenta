import express from "express";
import { getRooms, createRoom } from "../controllers/RoomController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/rooms", verifyRoles(ROLES_LIST[0]), getRooms);
router.post("/rooms", verifyRoles(ROLES_LIST[0]), createRoom);

export default router;
