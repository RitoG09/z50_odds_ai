"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQuery = handleQuery;
const agent_service_1 = require("../services/agent.service");
async function handleQuery(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }
        const answer = await (0, agent_service_1.queryAgent)(query);
        res.json({ answer });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Agent failed" });
    }
}
//# sourceMappingURL=agent.controller.js.map