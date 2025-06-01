import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfessors,
} from "../controllers/UsersController.js";
import { verifyRoles } from "../middlewares/verifyRole.js";
import ROLES_LIST from "../config/rolesList.js";

const router = express.Router();

router.get("/users", verifyRoles(ROLES_LIST[0]), getUsers);
router.post("/users", verifyRoles(ROLES_LIST[0]), createUser);
router.get("/professors", verifyRoles(ROLES_LIST[0]), getProfessors);
router.get("/users/:id", verifyRoles(ROLES_LIST[0]), getUserById);
router.patch("/users/:id", verifyRoles(ROLES_LIST[0]), updateUser);
router.delete("/users/:id", verifyRoles(ROLES_LIST[0]), deleteUser);

export default router;
