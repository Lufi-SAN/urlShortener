import express, { type NextFunction, type Request, type Response, type ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { aslStore } from './api/logging/loggerContext.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, redisConnectWithRetry } from './api/connections/redis.connection.js';
import pino from 'pino';
import getHelpRoute from './routes/get-help.route.js';
import createURIRoute from './routes/create-uri.route.js';
import callURIRoute from './routes/call-uri.route.js';
import loginRoute from './routes/login.route.js';
import signUpRoute from './routes/sign-up.route.js';
import { pgConnectWithRetry } from './api/connections/postgres.connection.js';
import path from 'path';

dotenv.config();

const app = express();
const v1ApiRouter = express.Router();
app.disable('x-powered-by');
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.set('view engine', 'ejs');
(async () => {
    try {
      await pgConnectWithRetry()
      await redisConnectWithRetry()
      app.use((req : Request, res : Response, next : NextFunction) => {
        const requestId = uuidv4();
        aslStore.run(new Map<string, any>([['requestId', requestId]]), () => {
          next();
        })
      })
      app.use(helmet());
      app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
          sendCommand: (...args) => redisClient.sendCommand(args)
          })
        })
      )
      app.use(express.json());

      const port = process.env.PORT || 3000;

      v1ApiRouter.use('/', getHelpRoute);
      v1ApiRouter.use('/sign-up', signUpRoute);
      v1ApiRouter.use('/login', loginRoute);
      v1ApiRouter.use('/create', createURIRoute);
      v1ApiRouter.use('/:shortUri', callURIRoute);
      //v1ApiRouter.use('/errors', errorHTMLRoute);

      app.use('/v1', v1ApiRouter);

      //Not Found Handler
      app.use((req : Request, res : Response, next : NextFunction) => {
        res.status(404).json({ error: "Not found" });
      })

      const errorHandler : ErrorRequestHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }

      //Global Error Handler
      app.use(errorHandler);

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
} catch(err) {
    
    process.exit(1)
}
})()