import mongoose, { Schema } from 'mongoose';
import { IAnalysis, AnalysisStatus } from './interfaces/analysis.interface';

const resultSchema = new Schema({
    classification: String,
    confidenceScore: Number,
    detectedArtifacts: [String],
    cpcScore: Number
}, { _id: false });

const analysisSchema = new Schema<IAnalysis>({
    eegDataId: {
        type: Schema.Types.ObjectId,
        ref: 'EEGData',
        required: true
    },
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    processedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: Object.values(AnalysisStatus),
        default: AnalysisStatus.PENDING
    },
    results: resultSchema,
    notes: String
});

const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
export default Analysis;