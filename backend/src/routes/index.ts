import { Router } from "express";
import matchRoutes from "./match.routes";
import authRoutes from "./auth.routes";
import favoriteRoutes from "./favorite.routes";
import agentRoutes from "./agent.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API v1" });
});
router.use("/matches", matchRoutes);
router.use("/auth", authRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/agent", agentRoutes);

export default router;
