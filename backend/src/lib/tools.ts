import { tool } from "langchain";
import * as z from "zod";
import { prisma } from "../lib/prisma";
import { fetchOdds } from "../services/odds.service";
import { getCache, setCache } from "../services/cache.service";

function generateCacheKey(match: any) {
  return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}

export const getMatchesTool = tool(
  async () => {
    const matches = await prisma.match.findMany();

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
      "MANDATORY TOOL. Use this to answer ANY question about matches, predictions, probabilities, best match, closest match, or odds. Returns match data with probabilities.",
    schema: z.object({}),
  },
);
