import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { IUser } from '../models/interfaces/user.interface';



const saveAnalysis = async (req: Request, res: Response): Promise<any> => {
    try {
        // The issue is likely that req.user doesn't have all the IUser properties
        // Let's debug what's coming in
        console.log('User in request:', req.user);
        console.log('API Response body:', req.body);
        
        // Make sure user is properly typed and has the required fields
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: 'User information is missing or incomplete' });
        }
        
        // Create a proper user object with the required _id field
        const user = {
            _id: req.user.userId,
            role: req.user.role
        };
        
        const apiResponse = req.body;
        const analyses = await AnalysisService.createAnalysis(user, apiResponse);
        res.status(201).json(analyses);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to save analysis'
        });
    }
};

const getAnalyses = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: 'User information is missing or incomplete' });
        }
        
        // Create a proper user object with the required _id field
        const user = {
            _id: req.user.userId,
            role: req.user.role
        };

        const analyses = await AnalysisService.getUserAnalyses(user);
        res.json(analyses);

    } catch(error) {
        console.error('Error in getAnalyses:', error);
        res.status(500).json({
            error: 'Failed to fetch analyses'
        });
    }
};

export default {
    saveAnalysis,
    getAnalyses
}