import { SignJWT } from "jose";
import dotenv from "dotenv";
dotenv.config();

export async function jwtSign(id: number, tokenVersion: number) {
    const accessSecretKey = new TextEncoder().encode(process.env.ACCESS_JWT_SECRET_KEY);
    const refreshSecretKey = new TextEncoder().encode(process.env.REFRESH_JWT_SECRET_KEY);
    const alg = "HS256";
    const jti = crypto.randomUUID();

    const issuer = "url-shortener-api";
    const audience = "url-shortener-users";

    const accessJWT = await new SignJWT({type: "access"})
    .setProtectedHeader({ alg })
    .setExpirationTime("15m")
    .setIssuedAt()
    .setSubject(id.toString())
    .setIssuer(issuer)
    .setAudience(audience)
    .sign(accessSecretKey);

    const refreshJWT = await new SignJWT({type: "refresh", tokenVersion : tokenVersion.toString()})
    .setProtectedHeader({ alg })
    .setExpirationTime("7d")
    .setIssuedAt()
    .setSubject(id.toString())
    .setIssuer(issuer)
    .setAudience(audience)
    .setJti(jti)
    .sign(refreshSecretKey);

    return { accessJWT, refreshJWT, jti };
}