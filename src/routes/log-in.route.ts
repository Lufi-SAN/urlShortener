import { Router } from "express";
import logInController from "../controllers/log-in.controllers.js";

const logInRoute = Router();

logInRoute.get('/', logInController.renderLogInPage)

logInRoute.post('/', logInController.validateLogInData, logInController.logInRateLimiter, logInController.checkUserDetails, logInController.authenticateUser);

export default logInRoute;
