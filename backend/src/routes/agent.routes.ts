import { Router } from "express";
import { handleQuery } from "../controllers/agent.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/query", authMiddleware, handleQuery);

export default router;
