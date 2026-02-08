import { Router } from "express";
import logInController from "../controllers/log-in.controllers.js";

const logInRoute = Router();

logInRoute.get('/', logInController.renderLogInPage)

// logInRoute.post('/login', logInController.validateLogInData, logInController.checkUserExists, logInController.authenticateUser);

export default logInRoute;
