import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { getCache, setCache } from "../services/cache.service";
import { fetchOdds } from "../services/odds.service";

const router = Router();

function generateCacheKey(match: any) {
  return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.body;
    const userId = req.user?.userId;

    if (!matchId || !userId) {
      return res
        .status(400)
        .json({ error: "Match ID and User ID are required" });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      update: {}, // nothing to update
      create: {
        userId,
        matchId,
      },
    });

    res.json(favorite);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:matchId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const matchId = req.params.matchId as string;
    const userId = req.user?.userId;

    if (!matchId || !userId) {
      return res
        .status(400)
        .json({ error: "Match ID and User ID are required" });
    }

    await prisma.favorite.delete({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
    });

    res.json({ message: "Favorite removed" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        match: true,
      },
    });

    const enriched = await Promise.all(
      favorites.map(async (fav) => {
        const match = fav.match;

        const cacheKey = generateCacheKey(match);

        let oddsData = await getCache(cacheKey);

        if (!oddsData) {
          oddsData = await fetchOdds(match);
          await setCache(cacheKey, oddsData);
        }

        return {
          match_id: match.id,
          teams: `${match.teamA} vs ${match.teamB}`,
          odds: oddsData.odds,
          probabilities: {
            teamA: oddsData.teamA_win_prob,
            teamB: oddsData.teamB_win_prob,
            draw: oddsData.draw_prob,
          },
        };
      }),
    );

    res.json(enriched);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

export default router;
