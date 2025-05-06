import Analysis from "../models/analysis.model";
import { Types } from 'mongoose';
import { IUser, UserRole } from '../models/interfaces/user.interface';

interface UserIdentifier {
    _id: Types.ObjectId;
    role?: UserRole;
}  

export class AnalysisService {
    static async createAnalysis(
        user: IUser | UserIdentifier,
        apiResponse: any,
        notes?: string
    ): Promise<any> {
        const analyses = [];

        console.log('Creating analysis with user ID:', user._id);
        console.log('API Response type:', typeof apiResponse);
        console.log('API Response keys:', Object.keys(apiResponse));
        

        const patients = Array.isArray(apiResponse) ? apiResponse : apiResponse.patients;
        
        if (!patients || !Array.isArray(patients)) {
            throw new Error('Invalid API response format');
        }


        for (const patientResult of apiResponse.patients) {
            console.log('Processing patient:', patientResult);
            
            if (!patientResult.patient_id) {
                console.log('Missing patient_id, skipping');
                continue;
            }

            const analysisData = {
                patientId: patientResult.patient_id.toString(),
                classification: (patientResult.outcome === 1 || patientResult.outcome === 2) ? 'Good' : 'Poor',
                confidenceScore: patientResult.outcome_probability,
                cpcScore: patientResult.cpc,
                analysisDate: new Date()
            };

            try {
                const analysis = new Analysis({
                    patientId: patientResult.patient_id.toString(),
                    performedBy: user._id, // This is now type-safe
                    status: 'completed',
                    results: analysisData,
                    notes
                });
    
                const savedAnalysis = await analysis.save();
                analyses.push(savedAnalysis);
            } catch (err) {
                console.error('Error saving analysis:', err);
                throw err;
            }
        }

        return analyses;
    }

    static async getUserAnalyses(user: IUser | UserIdentifier): Promise<any[]> {
        let query: { performedBy?: Types.ObjectId } = { performedBy: user._id as Types.ObjectId };

        if (user.role === 'admin') {
            query = {};
        }

        return Analysis.find(query)
        .populate('performedBy', 'firstName lastName role')
        .sort({
            createdAt: -1
        });
    }
}