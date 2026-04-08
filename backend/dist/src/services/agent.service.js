"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAgent = queryAgent;
const agent_1 = require("../lib/agent");
async function queryAgent(userQuery) {
    const res = await agent_1.agent.invoke({
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
//# sourceMappingURL=agent.service.js.map