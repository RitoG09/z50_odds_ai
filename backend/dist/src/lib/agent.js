"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const langchain_1 = require("langchain");
const tools_1 = require("./tools");
const groq_1 = require("@langchain/groq");
const llm = new groq_1.ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
});
exports.agent = (0, langchain_1.createAgent)({
    model: llm,
    tools: [tools_1.getMatchesTool],
});
//# sourceMappingURL=agent.js.map