"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = getCache;
exports.setCache = setCache;
const redis_1 = require("../lib/redis");
const TTL = 60 * 5; // 5 sec
async function getCache(key) {
    return redis_1.redis.get(key);
}
async function setCache(key, value) {
    return redis_1.redis.set(key, value, { ex: TTL });
}
//# sourceMappingURL=cache.service.js.map