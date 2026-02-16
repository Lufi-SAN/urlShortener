import type { NextFunction, Request, Response } from "express";
import userFormDataCheck from "./shared/userFormDataCheck.js";
import { userLogInDataSchema } from "./schemas/log-in.controllers.schema.js";
import { type UserLogInData } from "./schemas/log-in.controllers.schema.js";
import { checkUserDetailsService } from "../api/service/log-in-route/check-user-details.service.js";
import { generateUserTokenService } from "../api/service/log-in-route/generate-user-token.service.js";
import { buildLinks } from "../utils/hateoas.js";
import { buildMeta } from "../utils/metaBuilder.js";
import { SuccessJSON } from "../utils/successJSON.js";
import { isDomainError } from "../domain/user/user.errors.js";
import { loginAttemptService } from "../api/service/log-in-route/log-in-attempt.service.js";

const logInController = {
    renderLogInPage(req : Request, res: Response, next: NextFunction) {
        res.status(200).render('index', { 
            title: 'Log-In',
            page: 'pages/log-in',
            script: '/ejs-scripts/log-in.js'
        });
    },
    async checkUserDetails(req : Request, res: Response, next: NextFunction) {
        const username = (req.body as UserLogInData).username;
        const password = (req.body as UserLogInData).password;
        try {
            await loginAttemptService.increment(req.ip as string, username)
            req.userData = await checkUserDetailsService(username, password);
            await loginAttemptService.success(req.ip as string, username)
            next();
        } catch(err) {
            if(isDomainError(err as Error)) {
                await loginAttemptService.failure(req.ip as string, username)
                res.locals.errLinks = buildLinks(req, [{ rel: 'log-in', path: '/v1/log-in', method: 'GET' }, { rel: 'get-help', path: '/v1', method: 'GET' }]);
            }
            next(err)
        }
    },
    async authenticateUser(req : Request, res: Response, next: NextFunction) {
        const userId = req.userData!.id;
        const tokenVersion = req.userData!.token_version;
        try {
            const tokens = await generateUserTokenService(userId, tokenVersion);
            res.cookie('accessToken', tokens.accessJWT, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.cookie('refreshToken', tokens.refreshJWT, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            const links = buildLinks(req, [{ rel: 'create-uri', path: '/v1/create', method: 'GET' }, { rel: 'log-out', path: '/v1/log-out', method: 'POST' }, { rel: 'get-help', path: '/v1', method: 'GET' }]);
            const meta = buildMeta(req)
            return res.status(200).json(new SuccessJSON('success', 'User authenticated successfully', undefined, links, meta));
        } catch(err) {
            next(err)
        }
    }
}

export function validateLogInData(req : Request, res: Response, next: NextFunction) {
    userFormDataCheck(userLogInDataSchema, req, res, next);
}

export async function logInRateLimiter(req : Request, res: Response, next: NextFunction) {
    try {
        await loginAttemptService.rateLimit(req.ip as string, req.body.username)
        next()
    } catch(err) {
        if(isDomainError(err as Error)) {
            res.locals.links = buildLinks(req, [{ rel: 'get-help', path: '/v1', method: 'GET' }])
        }
        next(err)
    }
}

export default logInController;