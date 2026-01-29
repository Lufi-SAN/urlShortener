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
import { pgConnectWithRetry } from './api/connections/postgres.connection.js';

dotenv.config();

const app = express();
app.disable('x-powered-by');
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

      const port = process.env.PORT || 3000;

      app.get('/', getHelpRoute);
      app.post('/create', createURIRoute);
      app.get('/:shortUri', callURIRoute);

      app.use((req : Request, res : Response, next : NextFunction) => {//Not Found Handler
        res.status(404).json({ error: "Not found" });
      })

      const errorHandler : ErrorRequestHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }

      app.use(errorHandler);

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
} catch(err) {
    
    process.exit(1)
}
})()