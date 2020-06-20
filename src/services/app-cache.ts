import { RedisClient } from "redis";
import dotenv from "dotenv";
import { promisify } from "util";
dotenv.config();

const redisPort: number = +(process.env.REDIS_PORT || "");
const redisHost: string = process.env.REDIS_HOST || "";

export const AppCache: RedisClient = new RedisClient({
  port: redisPort,
  host: redisHost,
});

export const promisedCacheGet = promisify(AppCache.get).bind(AppCache);
export const promisedCacheSet = promisify(AppCache.set).bind(AppCache);

export const getFromCache = async (key: string): Promise<any> => {
  try {
    return await promisedCacheGet(key);
  } catch (error) {
    throw error;
  }
};

export const setInCache = async (key: string, data: string) => {
  try {
    return await promisedCacheSet(key, data);
  } catch (error) {
    throw error;
  }
};
