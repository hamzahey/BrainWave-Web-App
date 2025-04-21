import { Document, Types } from 'mongoose';

export interface MedicalHistoryItem {
    condition: string;
    diagnoseDate: Date;
    notes?: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface IPatient extends Document {
    userId: Types.ObjectId;
    dateOfBirth?: Date;
    gender?: string;
    address?: Address;
    medicalHistory?: MedicalHistoryItem[];
    allergies?: string[];
    emergencyContact?: EmergencyContact;
}

export interface PatientInput {
    userId: Types.ObjectId;
    dateOfBirth?: Date;
    gender?: string;
    address?: Address;
}