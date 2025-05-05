import { Document, Types } from 'mongoose';

export enum AnalysisStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface AnalysisResults {
    patientId: string;
    classification: string;
    confidenceScore: number;
    cpcScore: number;
    analysisDate: Date;
}

export interface IAnalysis extends Document {
    patientId: string;
    performedBy: Types.ObjectId;
    status: AnalysisStatus;
    results?: AnalysisResults;
    notes?: string;
    createdAt: Date;
}

