import { Router } from "express";
import signUpController from "../controllers/sign-up.controllers.js";

const signUpRoute = Router();

signUpRoute.get('/', signUpController.renderSignUpPage)

signUpRoute.post('/', signUpController.validateSignUpData, signUpController.checkUserExists, signUpController.createUserAccount);

export default signUpRoute;