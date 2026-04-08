"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesTool = void 0;
const langchain_1 = require("langchain");
const z = __importStar(require("zod"));
const prisma_1 = require("../lib/prisma");
const odds_service_1 = require("../services/odds.service");
const cache_service_1 = require("../services/cache.service");
function generateCacheKey(match) {
    return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}
exports.getMatchesTool = (0, langchain_1.tool)(async () => {
    const matches = await prisma_1.prisma.match.findMany();
    const enriched = await Promise.all(matches.map(async (match) => {
        const cacheKey = generateCacheKey(match);
        let oddsData = await (0, cache_service_1.getCache)(cacheKey);
        if (!oddsData) {
            oddsData = await (0, odds_service_1.fetchOdds)(match);
            await (0, cache_service_1.setCache)(cacheKey, oddsData);
        }
        return {
            match: `${match.teamA} vs ${match.teamB}`,
            teamA_prob: oddsData.teamA_win_prob,
            teamB_prob: oddsData.teamB_win_prob,
            draw_prob: oddsData.draw_prob,
        };
    }));
    return JSON.stringify(enriched);
}, {
    name: "get_matches",
    description: "Fetch all matches with probabilities. Use this whenever answering questions about matches.",
    schema: z.object({}),
});
//# sourceMappingURL=tools.js.map