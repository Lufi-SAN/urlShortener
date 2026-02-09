import type { ZodObject } from "zod";
import type { Request, NextFunction } from "express";
import { BadRequestError, InvalidSignUpCredentials } from "../../domain/user/user.errors.js";

export default function userFormDataCheck(schema: ZodObject, req: Request, next: NextFunction) {
    const parseResult = schema.safeParse(req.body);
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
}