"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOdds = fetchOdds;
const axios_1 = __importDefault(require("axios"));
const PYTHON_API_URL = process.env.PYTHON_API_URL;
async function fetchOdds(match) {
    try {
        const res = await axios_1.default.post(`${PYTHON_API_URL}/generate-odds`, {
            teamA: match.teamA,
            teamB: match.teamB,
            teamA_rating: match.teamA_rating,
            teamB_rating: match.teamB_rating,
        }, {
            timeout: 3000,
        });
        return res.data;
    }
    catch (error) {
        console.error("Python service error:", error);
        throw new Error("Failed to fetch odds");
    }
}
//# sourceMappingURL=odds.service.js.map