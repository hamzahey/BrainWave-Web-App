import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';
import { UserRole } from '../models/interfaces/user.interface';

const router = express.Router();

// Register new patient (public)
router.post('/register', authController.register);

// Register new doctor (admin only)
router.post('/register-doctor', 
  authMiddleware.authenticate, 
  roleMiddleware.authorize(UserRole.ADMIN), 
  authController.registerDoctor
);

// Login route (public)
router.post('/login', authController.login);

// Refresh token route (public)
router.post('/refresh-token', authController.refreshToken);

// Logout route (authenticated)
router.post('/logout', authController.logout);

// Check authentication status
router.get('/check', authMiddleware.authenticate, authController.checkAuth);

export default router;