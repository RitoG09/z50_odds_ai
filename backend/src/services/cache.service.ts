import { redis } from "../lib/redis";

const TTL = 60 * 5; // 5 sec

export async function getCache<T = any>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function setCache(key: string, value: any) {
  return redis.set(key, value, { ex: TTL });
}
