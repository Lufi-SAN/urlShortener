import type { ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError, InvalidUserFormCredentials } from "../../domain/user/user.errors.js";
import { buildLinks } from "../../utils/hateoas.js";

export default function userFormDataCheck(schema: ZodObject, req: Request, res: Response, next: NextFunction, linkArrayOne: {rel: string,path: string,method: string}[], linkArrayTwo: {rel: string,path: string,method: string}[], query? : true) {
    const parseResult = schema.safeParse( query ? req.query : req.body);
    if (!parseResult.success) {
        const isStructural = parseResult.error.issues.some(issue =>
            issue.code === 'invalid_type' ||
            issue.code === 'invalid_union' ||
            issue.code === 'unrecognized_keys'
        );
        if(isStructural) {
            res.locals.errLinks = buildLinks(req, linkArrayOne)
            const whatPath = req.baseUrl.split('/')[2]
            return next(new BadRequestError(`Malformed ${whatPath} data`));
        } else {
            res.locals.errLinks = buildLinks(req, linkArrayTwo)
            return next(new InvalidUserFormCredentials(query ? 'Invalid query data' : 'Invalid form data'))
        }
    }
    req.validated = parseResult.data
    console.log(req.validated)
    next();
}