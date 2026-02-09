import { jwtSign } from "../../auth/jwtSign.js";

export async function generateUserTokenService(userId: number, tokenVersion: number) {
    try {
        return await jwtSign(userId, tokenVersion);
    } catch(err) {
        throw err
    }
}