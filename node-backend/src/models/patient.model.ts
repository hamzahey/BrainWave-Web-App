import mongoose, { Schema } from "mongoose";
import { IPatient } from './interfaces/patient.interface';


const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
}, { _id: false });

const medicalHistorySchema = new Schema({
    condition: String,
    diagnoseDate: Date,
    notes: String    
}, { _id: false });

const emergencyContactSchema = new Schema({
    name: String,
    relationship: String,
    phoneNumber: String
}, { _id: false });

const patientSchema = new Schema<IPatient>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: String,
        unique: true,
        required: true
    },
    dateOfBirth: Date,
    gender: String,
    address: addressSchema,
    medicalHistory: [medicalHistorySchema],
    allergies: [String],
    emergencyContact: emergencyContactSchema
});


const Patient = mongoose.model<IPatient>('Patient', patientSchema);
export default Patient;