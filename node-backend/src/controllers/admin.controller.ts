import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import User from '../models/user.model';
import Patient from "../models/patient.model";
import Doctor from "../models/doctor.model";
import tokenService from "../services/token.service";
import { UserRole } from "../models/interfaces/user.interface";


const getAllPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {

        if (!req.user || req.user.role !== UserRole.ADMIN){
            res.status(403).json({
                message: "Unauthorized: Only Admin can access this resource"
            });
            return;
        }

        const patients = await Patient.find()
        .populate('userId', 'firstName lastName email phoneNumber')
        .sort({dateCreated: -1});

        res.status(200).json({
            count: patients.length,
            patients: patients.map(patient => ({
              patientId: patient.patientId,
              userDetails: patient.userId,
              dateOfBirth: patient.dateOfBirth,
              gender: patient.gender,
              address: patient.address,
              medicalHistory: patient.medicalHistory,
              allergies: patient.allergies,
              emergencyContact: patient.emergencyContact
            }))
          });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patients",
            error: (error as Error).message
        })
    }
}


const getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || req.user.role !== UserRole.ADMIN){
            res.status(403).json({ message: 'Unauthorized: Only Admin can access this resource' });
            return;
        }

        const { patientId } = req.params;

        const patient = await Patient.findOne({ patientId })
            .populate('userId', 'firstName lastName email phoneNumber');
        
        if (!patient) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }

        res.status(200).json({
            patient: {
                patientId: patient.patientId,
                userDetails: patient.userId,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                address: patient.address,
                medicalHistory: patient.medicalHistory,
                allergies: patient.allergies,
                emergencyContact: patient.emergencyContact
            }
        });

    } catch (error){
        res.status(500).json({
            message: 'Failed to Fetch Patient',
            error: (error as Error).message
        })
    }
}

const getAllDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            res.status(403).json({ message: 'Unauthorized: Only Admin can access this resource' });
            return;
        }

        const doctors = await Doctor.find()
        .populate('userId', 'firstName lastName email phoneNumber')
        .sort({dateCreated: -1})
        
        res.status(200).json({
            count: doctors.length,
            doctors: doctors.map(doctor => ({
                registrationNumber: doctor.registrationNumber,
                userDetails: doctor.userId,
                specialization: doctor.specialization,
                department: doctor.department,
                qualifications: doctor.qualifications,
                yearsOfExperience: doctor.yearsOfExperience
            }))
        });

    } catch (error){
        res.status(500).json({
            message: " Failed to Fetch Doctors", 
            error: (error as Error).message
        });
    }
}

const getDoctorByRegistrationNumber = async (req: Request, res: Response): Promise<void> =>{
    try{
        // Check if user is admin
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            res.status(403).json({ message: 'Unauthorized: Only Admin can access this resource' });
            return;
        }    
        
        const { registrationNumber } = req.params;

        const doctor = await Doctor.findOne({registrationNumber})
        .populate('userId', 'firstName lastName email phoneNumber');
        
        if (!doctor){
            res.status(404).json({
                message: "Doctor not found"
            });
            return;
        }

        res.status(200).json({
            doctor: {
                registrationNumber: doctor.registrationNumber,
                userDetails: doctor.userId,
                specialization: doctor.specialization,
                department: doctor.department,
                qualifications: doctor.qualifications,
                yearsOfExperience: doctor.yearsOfExperience
            }
        });
    }catch(error){
        res.status(500).json({
            message: 'Failed to Fetch Doctor',
            error: (error as Error).message
        })
    }
}


export default {
    getAllPatients,
    getPatientById,
    getAllDoctors,
    getDoctorByRegistrationNumber
};