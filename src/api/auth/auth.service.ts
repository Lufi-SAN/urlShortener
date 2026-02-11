import { jwtVerify, errors } from 'jose'
import dotenv from 'dotenv';
dotenv.config();
import { UnauthorizedUser } from '../../domain/user/user.errors.js';
import { getTVFromDB } from './store/getTVFromDB.js';
import { getTokenVersionFromRedis, setTokenVersionInRedis } from '../redis/tokenVersion.js';
 

export async function authService(accessToken: string, refreshToken: string) {
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
        const userId = refreshPayload.sub as string;
        let userCurrentTokenVersion = await getTokenVersionFromRedis(userId)
        if (!userCurrentTokenVersion) {
            userCurrentTokenVersion = await getTVFromDB(userId)
            await setTokenVersionInRedis(userId, userCurrentTokenVersion as number)
        }
        //check for dti too LATER
        if (refreshPayload.tokenVersion !== userCurrentTokenVersion) {
            throw new UnauthorizedUser('Invalid authentication tokens. Please log in again.');
        }
        return { id : accessPayload.sub as string }
    } catch (err) {
        if (err instanceof errors.JOSEError) {
            throw new UnauthorizedUser('Invalid authentication tokens. Please log in again.');
        }
        throw err
    }

}