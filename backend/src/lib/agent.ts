import { createAgent } from "langchain";
import { getMatchesTool } from "./tools";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

export const agent: any = createAgent({
  model: llm,
  tools: [getMatchesTool],
});
