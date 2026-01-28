import express, { type NextFunction, type Request, type Response, type ErrorRequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aslStore } from './api/logging/loggerContext.js';
import dotenv from 'dotenv';
import getHelpRoute from './routes/get-help.route.js';
import createURIRoute from './routes/create-uri.route.js';
import callURIRoute from './routes/call-uri.route.js';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use((req : Request, res : Response, next : NextFunction) => {
  const requestId = uuidv4();
  aslStore.run(new Map<string, any>([['requestId', requestId]]), () => {
    next();
  })
})

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