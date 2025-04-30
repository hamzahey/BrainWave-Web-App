import express from 'express';
import adminController from '../controllers/admin.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';
import { UserRole } from '../models/interfaces/user.interface';


const router = express.Router();

router.get('/patients', 
  authMiddleware.authenticate, 
  roleMiddleware.authorize(UserRole.ADMIN), 
  adminController.getAllPatients
);


router.get('/patient/:patientId', 
    authMiddleware.authenticate, 
    roleMiddleware.authorize(UserRole.ADMIN), 
    adminController.getPatientById
  );

router.get('/doctors', 
    authMiddleware.authenticate, 
    roleMiddleware.authorize(UserRole.ADMIN), 
    adminController.getAllDoctors
  );

  
router.get('/doctor/:registrationNumber', 
    authMiddleware.authenticate, 
    roleMiddleware.authorize(UserRole.ADMIN), 
    adminController.getDoctorByRegistrationNumber
  );

export default router;