import { Router } from "express";
import {
  deleteUser,
  editUser,
  getUserProfile,
  listUsers,
  registerUser,
} from "../controllers/userController";
import { validateToken } from "../middleware/validateToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/list-users", validateToken, isAdmin, listUsers);
router.get("/profile", validateToken, getUserProfile);
// Ruta para editar un usuario
router.put("/:id", validateToken, isAdmin, editUser);

// Ruta para eliminar un usuario
router.delete("/:id", validateToken, isAdmin, deleteUser);
router.post("/register-user", validateToken, isAdmin, registerUser);

export default router;
