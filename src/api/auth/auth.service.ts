import { jwtVerify, errors } from 'jose'
import dotenv from 'dotenv';
dotenv.config();
import { UnauthorizedUser } from '../../domain/user/user.errors.js';
import { getTVFromDB } from './store/getTVFromDB.js';
import { redisClient } from '../connections/redis.connection.js';
import type { RedisArgument } from 'redis';
 

export async function authService(accessToken: string, refreshToken: string): Promise<void> {
    try {
        const accessSecretKey = new TextEncoder().encode(process.env.ACCESS_JWT_SECRET_KEY);
        const refreshSecretKey = new TextEncoder().encode(process.env.REFRESH_JWT_SECRET_KEY);
        const { payload : accessPayload } = await jwtVerify(accessToken, accessSecretKey, {
            issuer: "url-shortener-api",
            audience: "url-shortener-users",
        })
        const { payload : refreshPayload } = await jwtVerify(refreshToken, refreshSecretKey, {
            issuer: "url-shortener-api",
            audience: "url-shortener-users",
        })
        //token valid after here, check for tampering and revocation
        if (accessPayload.sub !== refreshPayload.sub || accessPayload.type !== 'access' || refreshPayload.type !== 'refresh') {
            throw new UnauthorizedUser('Invalid authentication tokens. Please log in again.');
        }
        //revocation check
        const userId = parseInt(refreshPayload.sub as string);
        let userCurrentTokenVersion = await redisClient.get(`user:${userId}:tokenVersion`)
        if (!userCurrentTokenVersion) {
            userCurrentTokenVersion = await getTVFromDB(userId)
            await redisClient.set(`user:${userId}:tokenVersion`, userCurrentTokenVersion as RedisArgument, {expiration : {type: 'EX', value: 3600}})
        }
        if (refreshPayload.tokenVersion !== userCurrentTokenVersion || redisClient.dtiCheck) {
            throw new UnauthorizedUser('Invalid authentication tokens. Please log in again.');
        }
    } catch (err) {
        if (err instanceof errors.JOSEError) {
            throw new UnauthorizedUser('Invalid authentication tokens. Please log in again.');
        }
        throw err
    }

}