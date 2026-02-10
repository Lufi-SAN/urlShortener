import type { ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError, InvalidSignUpCredentials } from "../../domain/user/user.errors.js";
import { buildLinks } from "../../utils/hateoas.js";

export default function userFormDataCheck(schema: ZodObject, req: Request, res: Response, next: NextFunction) {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
                
        const isStructural = parseResult.error.issues.some(issue =>
            issue.code === 'invalid_type' ||
            issue.code === 'invalid_union' ||
            issue.code === 'unrecognized_keys'
        );
        if(isStructural) {
            res.locals.errLinks = buildLinks(req, [{ rel: 'sign-up', path: '/v1/sign-up', method: 'GET' }, { rel: 'get-help', path: '/v1', method: 'GET' }])
            const whatPath = req.baseUrl.split('/')[2]
            return next(new BadRequestError(`Malformed ${whatPath} data`));
        } else {
            res.locals.errLinks = buildLinks(req, [{ rel: 'sign-up', path: '/v1/sign-up', method: 'GET' }, { rel: 'get-help', path: '/v1', method: 'GET' }])
            return next(new InvalidSignUpCredentials('Invalid username or password'))
        }
    }
    next();
}