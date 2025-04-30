import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import User from '../models/user.model';
import Patient from "../models/patient.model";
import Doctor from "../models/doctor.model";
import tokenService from "../services/token.service";
import { UserRole } from "../models/interfaces/user.interface";

// Register Patient
const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, gender, patientId } = req.body;

        const existingUser = await User.findOne({ patientId });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const newUser = new User({
            email,
            password, // Assumes password hashing in User model pre-save hook
            firstName,
            lastName,
            phoneNumber,
            role: UserRole.PATIENT
        });

        await newUser.save();

        const newPatient = new Patient({
            userId: newUser._id,
            patientId,
            dateOfBirth,
            gender
        });

        await newPatient.save();

        const accessToken = tokenService.generateAccessToken(newUser._id as Types.ObjectId, newUser.role);
        const refreshToken = tokenService.generateRefreshToken(newUser._id as Types.ObjectId, newUser.role);

        

        await tokenService.storeRefreshToken(newUser._id as Types.ObjectId, refreshToken);
        
        tokenService.setCookies(res, accessToken, refreshToken);

        await User.findByIdAndUpdate(newUser._id, { lastLogin: new Date() });

        res.status(201).json({
            message: 'Registration Successful',
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
        return;
    }
};

// Register Doctor (Admin only)
const registerDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Admin Info: ", req.user);
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            res.status(403).json({ message: 'Unauthorized: Only Admin can register Doctors' });
            return;
        }

        const {
            email, password, firstName, lastName, phoneNumber, specialization,
            department, registrationNumber, qualifications, yearsOfExperience, hospitalName
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const existingDoctor = await Doctor.findOne({ registrationNumber });
        if (existingDoctor) {
            res.status(409).json({ message: `Doctor with registration number ${registrationNumber} already exists` });
            return;
        }

        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            role: UserRole.DOCTOR,
            hospitalName // Added per BrainWave requirements
        });

        await newUser.save();

        const newDoctor = new Doctor({
            userId: newUser._id,
            specialization,
            department,
            registrationNumber,
            qualifications,
            yearsOfExperience
        });

        await newDoctor.save();

        res.status(201).json({
            message: 'Doctor Registration Successful',
            doctor: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                specialization,
                department,
                hospitalName
            }
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Doctor registration failed', error: (error as Error).message });
        return;
    }
};

// Login
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        if (!user.isActive) {
            res.status(401).json({ message: 'Account is inactive' });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        const accessToken = tokenService.generateAccessToken(user._id as Types.ObjectId, user.role);
        const refreshToken = tokenService.generateRefreshToken(user._id as Types.ObjectId, user.role);

        await tokenService.storeRefreshToken(user._id as Types.ObjectId, refreshToken);

        tokenService.setCookies(res, accessToken, refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true, 
        });

        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: (error as Error).message });
        return;
    }
};

// Refresh Token
const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh Token Required" });
            return;
        }

        const decoded = tokenService.verifyRefreshToken(refreshToken);
        const user = await tokenService.findUserByRefreshToken(refreshToken);

        if (!user) {
            res.status(401).json({ message: "Invalid Refresh Token" });
            return;
        }

        const newAccessToken = tokenService.generateAccessToken(user._id as Types.ObjectId, user.role);
        const newRefreshToken = tokenService.generateRefreshToken(user._id as Types.ObjectId, user.role);

        await tokenService.storeRefreshToken(user._id as Types.ObjectId, newRefreshToken);

        tokenService.setCookies(res, newAccessToken, newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
        return;
    } catch (error) {
        res.status(401).json({ message: 'Token refresh failed', error: (error as Error).message });
        return;
    }
};

// Logout
const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Cookies received:", req?.cookies);
        console.log("Body received:", req?.body);

        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            const user = await tokenService.findUserByRefreshToken(refreshToken);

            if (user) {
                await tokenService.removeRefreshToken(user._id as Types.ObjectId);
            }
        }


        tokenService.clearCookies(res);

        res.status(200).json({ message: 'Logout Successful' });
        return;
    } catch (error) {

        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed', error: (error as Error).message });
        return;
    }
};


const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        
        if(!req.user){
            res.status(401).json({authnticated: false});
            return; 
        }

        const user = await User.findById(req.user.userId).select('-password -refreshToken');

        if(!user){
            res.status(401).json({authnticated: false});
            return;
        }

        res.status(200).json({
            authenticated: true,
            user: {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role
            }
          });
          return;
    } catch (error) {
        res.status(500).json({ message: 'Authentication auth failed', error: (error as Error).message });
        return;
    }
}

export default {
    register,
    registerDoctor,
    login,
    refreshToken,
    logout,
    checkAuth
};