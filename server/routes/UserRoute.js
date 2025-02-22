import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";
import ROLES_LIST from "../config/rolesList.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", verifyRoles(ROLES_LIST[0]), getUserById);
router.post("/users", verifyRoles(ROLES_LIST[0]), createUser);
router.patch("/users/:id", verifyRoles(ROLES_LIST[0]), updateUser);
router.delete("/users/:id", verifyRoles(ROLES_LIST[0]), deleteUser);

export default router;
