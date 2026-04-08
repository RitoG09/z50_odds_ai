import { tool } from "langchain";
import * as z from "zod";
import { prisma } from "../lib/prisma";
import { fetchOdds } from "../services/odds.service";
import { getCache, setCache } from "../services/cache.service";

function generateCacheKey(match: any) {
  return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}

export const getMatchesTool = tool(
  async (input) => {
    const matches = await prisma.match.findMany();

    let filtered = matches;

    if (input?.home_team && input?.away_team) {
      filtered = matches.filter(
        (m) => m.teamA === input.home_team && m.teamB === input.away_team,
      );
    }

    const enriched = await Promise.all(
      matches.map(async (match) => {
        const cacheKey = generateCacheKey(match);

        let oddsData = await getCache(cacheKey);

        if (!oddsData) {
          oddsData = await fetchOdds(match);
          await setCache(cacheKey, oddsData);
        }

        return {
          match: `${match.teamA} vs ${match.teamB}`,
          teamA_prob: oddsData.teamA_win_prob,
          teamB_prob: oddsData.teamB_win_prob,
          draw_prob: oddsData.draw_prob,
        };
      }),
    );

    return JSON.stringify(enriched);
  },
  {
    name: "get_matches",
    description:
      "MANDATORY TOOL. Use this for ALL match-related queries including predictions, probabilities, best matches, or comparisons.",
    schema: z
      .object({
        home_team: z.string().optional(),
        away_team: z.string().optional(),
      })
      .optional(),
  },
);
