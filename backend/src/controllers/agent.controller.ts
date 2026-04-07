import { Request, Response } from "express";
import { queryAgent } from "../services/agent.service";

export async function handleQuery(req: Request, res: Response) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const answer = await queryAgent(query);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Agent failed" });
  }
}
