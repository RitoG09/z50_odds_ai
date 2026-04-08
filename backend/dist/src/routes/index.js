"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const match_routes_1 = __importDefault(require("./match.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const favorite_routes_1 = __importDefault(require("./favorite.routes"));
const agent_routes_1 = __importDefault(require("./agent.routes"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ message: "API v1" });
});
router.use("/matches", match_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/favorites", favorite_routes_1.default);
router.use("/agent", agent_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map