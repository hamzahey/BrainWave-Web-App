import { Document, Types } from 'mongoose';

export interface IDoctor extends Document {
    userId: Types.ObjectId;
    specialization: string;
    department: string;
    registrationNumber: string;
    qualifications?: string[];
    yearsOfExperience?: number;
}

export interface DoctorInput {
    userId: Types.ObjectId;
    specialization: string;
    department: string;
    registrationNumber: string;
    qualifications?: string[];
    yearsOfExperience?: number;
}