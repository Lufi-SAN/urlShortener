import { type NextFunction, type Request, type Response } from "express";
import { userSignUpDataSchema, type UserSignUpData } from "../controllers/schemas/sign-up.controllers.schema.js";
import { errorData, ErrorJSON } from "../errors/custom-errors.errors.js";
import { errorTypesMapping, type ErrorTypesMappingProps } from "../errors/mappings/error-types-mapping.errors.js";
import { checkUserExists } from "../api/service/sign-up-route/check-user-exists.service.js";

const signUpController = {
    renderSignUpPage(req : Request, res: Response, next: NextFunction) {
        try {
            res.status(200).render('sign-up');
        } catch (error) {
            console.error("Error rendering sign-up page:", error);
            next(error)
        }
    },
    validateSignUpData(req : Request, res: Response, next: NextFunction) {
        const parseResult = userSignUpDataSchema.safeParse(req.body);
        if (!parseResult.success) {
            const errorD = errorData(...errorTypesMapping[422] as ErrorTypesMappingProps, 'Invalid username or password', req.path )
            const links = {
                retry: {
                    href: '/v1/sign-up',
                    rel: 'sign-up',
                    method: 'GET'
                },
                help: {
                    href: '/v1',
                    rel: 'get-help',
                    method: 'GET'
                }
            }
            return next(new ErrorJSON(undefined, errorD, links))
        }
        next();
    },
    checkUserExists(req : Request, res: Response, next: NextFunction) {
        const username = (req.body as UserSignUpData).username;
        checkUserExists(username);
    },
    createUserAccount() {
        
    }
}

export default signUpController;