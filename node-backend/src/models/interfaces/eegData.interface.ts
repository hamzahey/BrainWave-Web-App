import { Document, Types } from 'mongoose';

export interface EEGSignal {
    channelName: string;
    data: number[];
}

export interface EEGMetadata {
    samplingRate: number;
    duration: number;
    deviceType: string;
    electrodesUsed: string[]
}

export interface IEEGData extends Document {
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    recordDate: Date;
    rawDataPath?: string;
    signals: EEGSignal[];
    metadata: EEGMetadata;
}