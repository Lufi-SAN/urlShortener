import { createClient, type RedisClientType as ClientTypeFromRedis } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

export type RedisClientType = typeof redisClient

// Handle Redis client runtime errors. Failures after successful connection
redisClient.on("error", (err) => {
  console.error("[redis.connection.ts] Redis Client Error", err);
});

// Initial connection attempt & retries on startup/connection failure
const redisConnectWithRetry = async (retries: number = 5, delay: number = 2000): Promise<RedisClientType> => {
  for (let i = 0; i < retries; i++) {
    try {
      if(!redisClient.isOpen) {
        console.log('[redis.connection.ts] Attempting to connect to Redis...');
        await redisClient.connect();
        console.log('[redis.connection.ts] Connected to Redis successfully.');
      }
      break;
    }
    catch (err) {
        console.error(`[redis.connection.ts] Redis connection attempt ${i + 1} failed:`, err);
        if (i < retries - 1) {
            console.log(`[redis.connection.ts] Retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay));
        } else {
            console.error('[redis.connection.ts] All Redis connection attempts failed.');
            throw err;
        }
    }
  }
  return redisClient;
}

export { redisClient, redisConnectWithRetry }



