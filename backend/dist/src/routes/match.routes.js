"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const odds_service_1 = require("../services/odds.service");
const cache_service_1 = require("../services/cache.service");
const router = (0, express_1.Router)();
function generateCacheKey(match) {
    return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalMatches = await prisma_1.prisma.match.count();
        const totalPages = Math.ceil(totalMatches / limit);
        const matches = await prisma_1.prisma.match.findMany({
            skip,
            take: limit,
            orderBy: { startTime: "asc" },
        });
        const enrichedMatches = await Promise.all(matches.map(async (match) => {
            const cacheKey = generateCacheKey(match);
            let oddsData = await (0, cache_service_1.getCache)(cacheKey);
            if (!oddsData) {
                oddsData = await (0, odds_service_1.fetchOdds)(match);
                await (0, cache_service_1.setCache)(cacheKey, oddsData);
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
        }));
        res.json({
            matches: enrichedMatches,
            pagination: {
                totalMatches,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
});
exports.default = router;
//# sourceMappingURL=match.routes.js.map