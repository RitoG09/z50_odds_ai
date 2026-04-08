import { agent } from "../lib/agent";

export async function queryAgent(userQuery: string): Promise<string> {
  const res: any = await agent.invoke({
    messages: [
      {
        role: "system",
        content: `
You are a sports betting analyst.

IMPORTANT RULES:
- ALWAYS use the "get_matches" tool when the question involves:
  - predictions
  - probabilities
  - use percentage for giving predictions
  - best match
  - closest match
  - odds

- DO NOT guess match data
- DO NOT answer without calling the tool for match-related queries

When tool returns JSON string:
- Parse it
- Use probabilities to reason
- Give clear explanation
`,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
  });

  const lastMessage = res.messages[res.messages.length - 1];
  return lastMessage?.content || "No response generated.";
}
