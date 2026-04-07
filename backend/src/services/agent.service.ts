import { prisma } from "../lib/prisma";
import { fetchOdds } from "./odds.service";
import { getCache, setCache } from "./cache.service";
import { llm } from "../lib/llm";

function generateCacheKey(match: any) {
  return `odds:${match.teamA}-${match.teamB}-${match.teamA_rating}-${match.teamB_rating}`;
}

async function getMatchesWithOdds() {
  const matches = await prisma.match.findMany();

  return Promise.all(
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
}

export async function queryAgent(userQuery: string) {
  const matches = await getMatchesWithOdds();

  const systemPrompt = `
You are a sports betting analyst.

Rules:
- Use probabilities to reason
- Be concise but clear
- Return the answer of probabilities in percentage.

`;

  const userPrompt = `
Matches:
${matches
  .map(
    (m) =>
      `${m.match} → A:${m.teamA_prob}, B:${m.teamB_prob}, Draw:${m.draw_prob}`,
  )
  .join("\n")}

Question:
${userQuery}
`;

  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  return response.content;
}
