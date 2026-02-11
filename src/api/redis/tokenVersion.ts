import { redisClient } from '../connections/redis.connection.js';

export async function getTokenVersionFromRedis(userId: string): Promise<number | null> {
    const res = await redisClient.get(`user:${userId}:tokenVersion`)
    if (!res) {
        return null
    }
    return parseInt(res, 10)
}

export async function setTokenVersionInRedis(userId: string, tokenVersion: number) {
    return await redisClient.set(`user:${userId}:tokenVersion`, tokenVersion, {expiration : {type: 'EX', value: 3600}})
}