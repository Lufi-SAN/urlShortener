import type { NextFunction, Request, Response } from "express";

const logInController = {
    renderLogInPage(req : Request, res: Response, next: NextFunction) {
        res.status(200).render('index', { 
            title: 'Log-In',
            page: 'pages/log-in',
            script: 'log-in.js'
        });
    }
}

export default logInController;