import { Document, Types } from 'mongoose';

export enum AnalysisStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface AnalysisResults {
    classification: string;
    condidenceScore: number;
    detectedArtifacts?: string[];
    cpcScore: number;
}

export interface IAnalysis extends Document {
    eegDataId: Types.ObjectId;
    processedBy: Types.ObjectId;
    processedDate: Date;
    status: AnalysisStatus;
    results?: AnalysisResults;
    notes?: string;
}

