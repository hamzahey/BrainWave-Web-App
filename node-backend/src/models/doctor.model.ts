import mongoose, { Schema} from "mongoose";
import { IDoctor } from './interfaces/doctor.interface';

const doctorSchema = new Schema<IDoctor>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true, 
        unique: true
    },
    qualifications: [String],
    yearsOfExperience: Number
});

const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
export default Doctor;