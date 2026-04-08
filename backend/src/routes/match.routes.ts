import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { fetchOdds } from "../services/odds.service";
import { getCache, setCache } from "../services/cache.service";

const router = Router();

function generateCacheKey(match: any) {
  return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalMatches = await prisma.match.count();
    const totalPages = Math.ceil(totalMatches / limit);

    const matches = await prisma.match.findMany({
      skip,
      take: limit,
      orderBy: { startTime: "asc" },
    });

    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        const cacheKey = generateCacheKey(match);
        let oddsData = await getCache(cacheKey);

        if (!oddsData) {
          oddsData = await fetchOdds(match);
          await setCache(cacheKey, oddsData);
        }

        return {
          match_id: match.id,
          teams: `${match.teamA} vs ${match.teamB}`,
          startTime: match.startTime,
          odds: oddsData.odds,
          probabilities: {
            teamA: oddsData.teamA_win_prob,
            teamB: oddsData.teamB_win_prob,
            draw: oddsData.draw_prob,
          },
        };
      }),
    );
    res.json({
      matches: enrichedMatches,
      pagination: {
        totalMatches,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

export default router;
