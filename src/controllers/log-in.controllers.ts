import type { NextFunction, Request, Response } from "express";
import userFormDataCheck from "./shared/userFormDataCheck.js";
import { userLogInDataSchema } from "./schemas/log-in.controllers.schema.js";
import { type UserLogInData } from "./schemas/log-in.controllers.schema.js";
import { checkUserDetailsService } from "../api/service/log-in-route/check-user-details.service.js";
import { generateUserTokenService } from "../api/service/log-in-route/generate-user-token.service.js";

const logInController = {
    renderLogInPage(req : Request, res: Response, next: NextFunction) {
        res.status(200).render('index', { 
            title: 'Log-In',
            page: 'pages/log-in',
            script: 'log-in.js'
        });
    },
    validateLogInData(req : Request, res: Response, next: NextFunction) {
        userFormDataCheck(userLogInDataSchema, req, next);
    },
    async checkUserDetails(req : Request, res: Response, next: NextFunction) {
        const username = (req.body as UserLogInData).username;
        const password = (req.body as UserLogInData).password;
        try {
            const user = await checkUserDetailsService(username, password);
            req.userData = user
            next();
        } catch(err) {
            next(err)
        }
    },
    async authenticateUser(req : Request, res: Response, next: NextFunction) {
        const userId = req.userData!.id;
        const tokenVersion = req.userData!.token_version;
        try {
            const tokens = await generateUserTokenService(userId, tokenVersion);
        } catch(err) {
            next(err)
        }
    }
}

export default logInController;