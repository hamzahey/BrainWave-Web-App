import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { IUser, UserRole } from '../models/interfaces/user.interface';
import Patient from '../models/patient.model';
import Analysis from '../models/analysis.model';
import Doctor from '../models/doctor.model';



const saveAnalysis = async (req: Request, res: Response): Promise<any> => {
    try {
        // The issue is likely that req.user doesn't have all the IUser properties
        // Let's debug what's coming in
        console.log('User in request:', req.user);
        console.log('API Response body:', req.body);
        
        // Make sure user is properly typed and has the required fields
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: 'User information is missing or incomplete' });
        }
        
        // Create a proper user object with the required _id field
        const user = {
            _id: req.user.userId,
            role: req.user.role
        };
        
        const apiResponse = req.body;
        const analyses = await AnalysisService.createAnalysis(user, apiResponse);
        res.status(201).json(analyses);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to save analysis'
        });
    }
};

const getAnalyses = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: 'User information is missing or incomplete' });
        }
        
        // Create a proper user object with the required _id field
        const user = {
            _id: req.user.userId,
            role: req.user.role
        };

        const analyses = await AnalysisService.getUserAnalyses(user);
        res.json(analyses);

    } catch(error) {
        console.error('Error in getAnalyses:', error);
        res.status(500).json({
            error: 'Failed to fetch analyses'
        });
    }
};

const getAnalysesByPatient = async (req: Request, res: Response): Promise<void> => {
    try {

        if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.DOCTOR)){
            res.status(403).json({
                message: 'Unauthorized: Only Admin and Doctors can access this resource'
            });
            return;
        }

        const { patientId } = req.params;

        // Check if the patient exists
        const patient = await Patient.findOne({ patientId });
        console.log(patient);

        if (!patient) {
            res.status(404).json({
                message: 'Patient not found'
            });
            return;
        }

        // Fetch all analyses related to this patientId string
        const analyses = await Analysis.find({ performedBy: patient.userId})
            .populate('performedBy', 'firstName lastName role') // Optional: include who performed it
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: analyses.length,
            analyses
        });
        return 
    } catch (error) {
        console.error('Error in getAnalysesByPatient', error);
        res.status(500).json({
            message: 'Failed to fetch analyses by Patient',
            error: (error as Error).message
        })
    }
}

const getAnalysesByDoctorRegistrationNumber = async (req: Request, res: Response): Promise<void> => {
    try {
        const { registrationNumber } = req.params;

        // Only Admin can access this
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            res.status(403).json({ message: 'Unauthorized: Only Admin can access this resource' });
            return
        }

        const doctor = await Doctor.findOne({ registrationNumber });
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return 
        }

        const analyses = await Analysis.find({ performedBy: doctor.userId })
            .populate('performedBy', 'firstName lastName role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: analyses.length,
            analyses
        });

        return;
    } catch (error) {
        console.error('Error in getAnalysesByDoctorRegistrationNumber:', error);
        res.status(500).json({
            message: 'Failed to fetch analyses for doctor',
            error: (error as Error).message
        });
    }
};


const getAllAnalyses = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure the user is authenticated and is an Admin
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            res.status(403).json({
                message: 'Unauthorized: Only Admin can access this resource'
            });
            return;
        }

        // Fetch all analyses and populate performedBy
        const analyses = await Analysis.find({})
            .populate('performedBy', 'firstName lastName role') // include who performed the analysis
            .sort({ createdAt: -1 }); // sort by most recent

        res.status(200).json({
            count: analyses.length,
            analyses
        });

    } catch (error) {
        console.error('Error in getAllAnalyses:', error);
        res.status(500).json({
            message: 'Failed to fetch all analyses',
            error: (error as Error).message
        });
    }
};


export default {
    saveAnalysis,
    getAnalyses,
    getAnalysesByPatient,
    getAnalysesByDoctorRegistrationNumber,
    getAllAnalyses
}