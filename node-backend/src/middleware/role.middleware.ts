import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/interfaces/user.interface';

const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction ): void => {
        if (!req.user || !req.user.role) {
            res.status(403).json({message: "Access denied"});
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({message: "Insufficient Permissions"});
            return;
        }

        next();
    }
}

export default {
    authorize
};