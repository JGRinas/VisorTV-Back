import { Router } from "express";
import { createScreen } from "../controllers/screenController";
import { validateToken } from "../middleware/validateToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

// Solo administradores pueden crear pantallas
router.post("/create", validateToken, isAdmin, createScreen);

export default router;
