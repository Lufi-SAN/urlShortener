import type { Request, Response, NextFunction } from 'express';
import { buildLinks } from '../../utils/hateoas.js';
import { isDomainError, UnauthorizedUser } from '../../domain/user/user.errors.js';
import { authService } from './auth.service.js';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try { 
        if (!req.cookies.accessToken || !req.cookies.refreshToken) {
            res.locals.errLinks = buildLinks(req, [{ rel: 'log-in', path: '/v1/log-in', method: 'GET' }]);
            return next(new UnauthorizedUser('Authentication tokens are missing. Please log in.'));  
        }
        const accessToken = req.cookies.accessToken
        const refreshToken = req.cookies.refreshToken
        await authService(accessToken, refreshToken);
        
    } catch (err) {
        if(isDomainError(err as Error)) {
            res.locals.errLinks = buildLinks(req, [{ rel: 'log-in', path: '/v1/log-in', method: 'GET' }]);
        }
        throw err
    }
    

}