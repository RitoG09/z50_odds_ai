"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
async function registerUser(email, password) {
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: { email, password: hashed },
    });
    return user;
}
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
}
//# sourceMappingURL=auth.service.js.map