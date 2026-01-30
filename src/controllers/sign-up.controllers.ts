import { type NextFunction, type Request, type Response } from "express";
import { userSignUpDataSchema, type UserSignUpData } from "../controllers/schemas/sign-up.controllers.schema.js";
import { HttpError } from "../errors/custom-errors.errors.js";

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
        try {
            const parseResult = userSignUpDataSchema.safeParse(req.body);
            if (!parseResult.success) {
               throw new HttpError()
            }
        } catch (error) {

        }
    }
}

export default signUpController;