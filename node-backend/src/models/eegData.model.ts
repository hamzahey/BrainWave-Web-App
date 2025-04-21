import mongoose, {Schema} from 'mongoose';
import {IEEGData} from './interfaces/eegData.interface';
import { channel } from 'diagnostics_channel';
import { duplexPair } from 'stream';

const signalSchema = new Schema({
    channelName: String,
    data: [Number] 
}, { _id: false });

const metadataSchema = new Schema({
    samplingRate: Number,
    duration: Number,
    deviceType: String,
    electrodesUsed: [String]
}, { _id: false });

const eegDataSchema = new Schema<IEEGData>({
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    recordDate: {
      type: Date,
      default: Date.now
    },
    rawDataPath: String,
    signals: [signalSchema],
    metadata: {
      type: metadataSchema,
      required: true
    }
  });

const EEGData = mongoose.model<IEEGData>('EEGData', eegDataSchema);
export default EEGData;