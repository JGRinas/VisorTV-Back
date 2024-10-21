import { Router } from "express";
import {
  createScreen,
  getAssignedScreens,
  updateScreen,
} from "../controllers/screenController";
import { validateToken } from "../middleware/validateToken";
import { isAdmin } from "../middleware/isAdmin";
import { isAdminOrOperator } from "../middleware/isAdminOrOperator";

const router = Router();

// Solo administradores pueden crear pantallas
router.post("/create", validateToken, isAdmin, createScreen);

//Obtener pantallas asignadas como operador
router.get("/assigned", validateToken, isAdminOrOperator, getAssignedScreens);

//Editar pantalla como operador
router.put("/update/:screenId", validateToken, isAdminOrOperator, updateScreen);

export default router;
