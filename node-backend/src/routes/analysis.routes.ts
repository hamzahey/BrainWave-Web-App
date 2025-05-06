import express from 'express';
import analysisController from '../controllers/analysis.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';
import { UserRole } from '../models/interfaces/user.interface';


const router = express.Router();


router.post('/save', 
  authMiddleware.authenticate, 
  analysisController.saveAnalysis
);

router.get('/', 
    authMiddleware.authenticate, 
    analysisController.getAnalyses
);

router.get('/patient/:patientId', 
  authMiddleware.authenticate,
  analysisController.getAnalysesByPatient); // Admin + Doctor


router.get('/doctor/:registrationNumber', 
    authMiddleware.authenticate,
    analysisController.getAnalysesByDoctorRegistrationNumber);


router.get(
      '/all',
      authMiddleware.authenticate,
      analysisController.getAllAnalyses
    );
    

export default router;