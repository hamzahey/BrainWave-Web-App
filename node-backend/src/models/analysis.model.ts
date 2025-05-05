import mongoose, { Schema } from 'mongoose';
import { IAnalysis, AnalysisStatus } from './interfaces/analysis.interface';

const resultSchema = new Schema({
    patientId: {
        type: String,
        required: true
    },
    classification: {
        type: String,
        required: true,
        enum: ['Good', 'Poor']
    },
    confidenceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    cpcScore: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    analysisDate: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const analysisSchema = new Schema<IAnalysis>({
    patientId: {
        type: String,
        required: true
    },
    performedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(AnalysisStatus),
        default: AnalysisStatus.COMPLETED
    },
    results: resultSchema,
    notes: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
export default Analysis;