import { createAgent } from "langchain";
import { getMatchesTool } from "./tools";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0,
});

export const agent: any = createAgent({
  model: llm,
  tools: [getMatchesTool],
});
