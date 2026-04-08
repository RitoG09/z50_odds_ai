import { agent } from "../lib/agent";

export async function queryAgent(userQuery: string) {
  const res = await agent.invoke({
    messages: [
      {
        role: "user",
        content: userQuery,
      },
    ],
  });

  const lastMessage = res.messages[res.messages.length - 1];
  return lastMessage?.content || "No response generated.";
}
