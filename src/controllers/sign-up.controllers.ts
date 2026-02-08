import { type NextFunction, type Request, type Response } from "express";
import { userSignUpDataSchema, type UserSignUpData } from "../controllers/schemas/sign-up.controllers.schema.js";
import { checkUserExistsService } from "../api/service/sign-up-route/check-user-exists.service.js";
import { BadRequestError, InvalidSignUpCredentials, isDomainError, UserAlreadyExists } from "../domain/user/user.errors.js";
import { buildLinks } from "../utils/hateoas.js";
import { createNewUserService } from "../api/service/sign-up-route/create-new-user.service.js";
import { SuccessJSON } from "../utils/successJSON.js";
import { buildMeta } from "../utils/metaBuilder.js";

const signUpController = {
    renderSignUpPage(req : Request, res: Response, next: NextFunction) {
        res.status(200).render('index', { 
            title: 'Sign Up',
            page: 'pages/sign-up',
            script: '/ejs-scripts/sign-up.js' 
        });
    },
    validateSignUpData(req : Request, res: Response, next: NextFunction) {
        const parseResult = userSignUpDataSchema.safeParse(req.body);
        if (!parseResult.success) {
            
            const isStructural = parseResult.error.issues.some(issue =>
                issue.code === 'invalid_type' ||
                issue.code === 'invalid_union' ||
                issue.code === 'unrecognized_keys'
            );
            if(isStructural) {
                return next(new BadRequestError('Malformed sign-up data'));
            } else {
                return next(new InvalidSignUpCredentials('Invalid username or password'))
            }
        }
        next();
    },
    async checkUserExists(req : Request, res: Response, next: NextFunction) {
        const username = (req.body as UserSignUpData).username;
        try {
            const doesUserExist = await checkUserExistsService(username);
            if (doesUserExist) {
                throw new UserAlreadyExists('User with this username already exists');
            }
            next()
        } catch(err) {//dynamism here too; check type of error first
            if (isDomainError(err as Error)) {
                res.locals.links = buildLinks(req, [{ rel: 'create-uri', path: '/v1/create', method: 'GET' }, { rel: 'get-help', path: '/v1', method: 'GET' }]);
            } 
            next(err)
        }
    },
    async createUserAccount(req : Request, res: Response, next: NextFunction) {
        const username = (req.body as UserSignUpData).username;
        const password = (req.body as UserSignUpData).password;
        try {
            const user = await createNewUserService(username, password);
            if (user) { 
                const data = {
                    username: user.username,
                    created_at: user.created_at
                }
                const links = buildLinks(req, [{ rel: 'log-in', path: '/v1/log-in', method: 'GET' }, { rel: 'get-help', path: '/v1', method: 'GET' }]);
                const meta = buildMeta(req);
                res.status(201).json(new SuccessJSON('success', 'User account created successfully', data, links, meta));
            }
        } catch(err) {
            next(err);
        }
    }
}

export default signUpController;