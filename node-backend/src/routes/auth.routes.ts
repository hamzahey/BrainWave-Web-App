import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';
import { UserRole } from '../models/interfaces/user.interface';

const router = express.Router();

router.post('/register', authController.register);

router.post('/register-doctor', 
    authMiddleware.authenticate, 
    roleMiddleware.authorize(UserRole.ADMIN), 
    authController.registerDoctor
)

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authMiddleware.authenticate, authController.logout);

export default router;