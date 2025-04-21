import { Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    PATIENT = 'patient'
}

export interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateCreated: Date;
    lastLogin?: Date;
    isActive: boolean;
    refreshToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: UserRole
}