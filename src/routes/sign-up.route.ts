import { Router } from "express";

const signUpRoute = Router();

signUpRoute.get('/', (req, res) => {
    res.render('sign-up');
})

signUpRoute.post('/', (req, res) => {
    
})

export default signUpRoute;