import express, { type NextFunction, type Request, type Response, type ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import getHelpRoute from './routes/get-help.route.js';
import createURIRoute from './routes/create-uri.route.js';
import callURIRoute from './routes/call-uri.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', getHelpRoute);
app.post('/create', createURIRoute);
app.get('/:shortUri', callURIRoute);

app.use((req : Request, res : Response, next : NextFunction) => {//Not Found Handler

})

const errorHandler : ErrorRequestHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});