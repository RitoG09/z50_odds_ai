import axios from "axios";

const PYTHON_API_URL = process.env.PYTHON_API_URL!;

export async function fetchOdds(match: {
  teamA: string;
  teamB: string;
  teamA_rating: number;
  teamB_rating: number;
}) {
  try {
    const res = await axios.post(
      `${PYTHON_API_URL}/generate-odds`,
      {
        teamA: match.teamA,
        teamB: match.teamB,
        teamA_rating: match.teamA_rating,
        teamB_rating: match.teamB_rating,
      },
      {
        timeout: 3000,
      },
    );

    return res.data;
  } catch (error) {
    console.error("Python service error:", error);
    throw new Error("Failed to fetch odds");
  }
}
