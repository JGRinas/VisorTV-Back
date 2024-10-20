import { Router } from "express";
import { listUsers } from "../controllers/userController";
import { validateToken } from "../middleware/validateToken";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/list-users", validateToken, isAdmin, listUsers);

export default router;
