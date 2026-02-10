import { jwtSign } from "../../auth/jwtSign.js";

export async function generateUserTokenService(userId: number, tokenVersion: number) {
    return await jwtSign(userId, tokenVersion);
}