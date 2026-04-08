"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../lib/prisma");
const cache_service_1 = require("../services/cache.service");
const odds_service_1 = require("../services/odds.service");
const router = (0, express_1.Router)();
function generateCacheKey(match) {
    return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}
router.post("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { matchId } = req.body;
        const userId = req.user?.userId;
        if (!matchId || !userId) {
            return res
                .status(400)
                .json({ error: "Match ID and User ID are required" });
        }
        const favorite = await prisma_1.prisma.favorite.upsert({
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete("/:matchId", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const matchId = req.params.matchId;
        const userId = req.user?.userId;
        if (!matchId || !userId) {
            return res
                .status(400)
                .json({ error: "Match ID and User ID are required" });
        }
        await prisma_1.prisma.favorite.delete({
            where: {
                userId_matchId: {
                    userId,
                    matchId,
                },
            },
        });
        res.json({ message: "Favorite removed" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const favorites = await prisma_1.prisma.favorite.findMany({
            where: { userId },
            include: {
                match: true,
            },
        });
        const enriched = await Promise.all(favorites.map(async (fav) => {
            const match = fav.match;
            const cacheKey = generateCacheKey(match);
            let oddsData = await (0, cache_service_1.getCache)(cacheKey);
            if (!oddsData) {
                oddsData = await (0, odds_service_1.fetchOdds)(match);
                await (0, cache_service_1.setCache)(cacheKey, oddsData);
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
        }));
        res.json(enriched);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
});
exports.default = router;
//# sourceMappingURL=favorite.routes.js.map