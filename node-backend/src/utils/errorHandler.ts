import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { error } from 'console';

interface AppError extends Error {
    statusCode?: number;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;

    logger.error(`Error: ${err.message}`);
    logger.error(err.stack || '');

    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? err.stack : undefined,
    });
};

export default errorHandler;