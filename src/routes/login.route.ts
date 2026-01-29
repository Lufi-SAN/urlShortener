import { Router } from "express";

const loginRoute = Router();

loginRoute.post('/login', (req, res) => {

    // Authentication logic goes here
    res.status(200).json({ message: "Login successful" });
})

export default loginRoute;
