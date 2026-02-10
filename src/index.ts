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
import shortURISRoute from './routes/short-uris.route.js';
import callURIRoute from './routes/call-uri.route.js';
import logInRoute from './routes/log-in.route.js';
import signUpRoute from './routes/sign-up.route.js';
import logOutRoute from './routes/log-out.route.js';
import passwordRoute from './routes/password.route.js';
import { pgConnectWithRetry } from './api/connections/postgres.connection.js';
import path from 'path';
import { errorData, ErrorJSON } from "./errors/custom-errors.errors.js";
import { errorTypesMapping, type ErrorTypesMappingProps } from "./errors/mappings/error-types-mapping.errors.js";
import { isDomainError } from './domain/user/user.errors.js';
import { buildLinks } from './utils/hateoas.js';
import cookieParser from 'cookie-parser';

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
      app.use(express.static(path.join(process.cwd(), 'src', 'public')));
      app.use(express.json());
      app.use(cookieParser());

      const port = process.env.PORT || 3000;

      app.use((req, res, next) => {
        res.locals.defaultErrLinks = buildLinks(req, [{ rel: 'get-help', path: '/v1', method: 'GET' }]);
        next();
      });

      //API ROUTES
      v1ApiRouter.use('/', getHelpRoute);
      v1ApiRouter.use('/sign-up', signUpRoute);
      v1ApiRouter.use('/log-in', logInRoute);
      v1ApiRouter.use('/short-uris', shortURISRoute);
      v1ApiRouter.use('/call/:shortUri', callURIRoute);
      v1ApiRouter.use('/log-out', logOutRoute);
      v1ApiRouter.use('/password', passwordRoute);
      //v1ApiRouter.use('/errors', errorHTMLRoute);

      app.use('/v1', v1ApiRouter);

      //NOT FOUND HANDLER
      app.use((req : Request, res : Response, next : NextFunction) => {
        res.status(404).json({ error: "Not found" });
      })

      //GLOBAL ERROR HANDLER
      const errorHandler : ErrorRequestHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
        console.error(err);
        
        let code = 500
        const path = req.protocol + '://' + req.get('host') + req.originalUrl;
        const requestId = aslStore.getStore()?.get('requestId') || 'unknown';
        let errorD;
        if (isDomainError(err)) {
          code = err.code
          const message = err.message
          errorD = errorData(...errorTypesMapping[code] as ErrorTypesMappingProps, message, path )
        } else {
          errorD = errorData(...errorTypesMapping[500] as ErrorTypesMappingProps, 'An unexpected error occurred on the server.', path )
        }
        
        const errorJSON = new ErrorJSON(undefined, requestId, errorD, res.locals.errLinks || res.locals.defaultErrLinks || {});

        res.status(code).json(errorJSON.toJSON());
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