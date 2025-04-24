import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import tokenService from '../services/token.service';
import { UserRole } from '../models/interfaces/user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: Types.ObjectId;
                role: UserRole;
            };
        }
    }
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {

        let token = req.cookies.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer')) {
                token = authHeader.split(" ")[1];
            }
        }


        if (!token) {
            res.status(401).json({message: 'Authentication Required'})
            return
        }

        const decoded = tokenService.verifyAccessToken(token);

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next()
    } catch (error) {
        res.status(401).json({message: 'Invalid or expired token', error: (error as Error).message})
    }
}

export default {
    authenticate
};