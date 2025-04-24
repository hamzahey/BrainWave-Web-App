import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config/config';
import { Response } from 'express';
import User from '../models/user.model';
import { UserRole } from '../models/interfaces/user.interface';


interface TokenPayload {
    userId: Types.ObjectId;
    role: UserRole;
  }
  

const generateAccessToken = (userId: Types.ObjectId, role: UserRole): string => {
    return jwt.sign(
      { userId, role } as TokenPayload,
      config.jwt.accessTokenSecret as string,
      { expiresIn: '1h' }
    );
  };
  
const generateRefreshToken = (userId: Types.ObjectId, role: UserRole): string => {
    return jwt.sign(
      { userId, role } as TokenPayload,
      config.jwt.refreshTokenSecret as string,
      { expiresIn: '7d'}
    );
  };


const storeRefreshToken = async (userId: Types.ObjectId, refreshToken: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, { refreshToken });
}

const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    // Set access token cookie
    res.cookie('accessToken', accessToken, {
      ...config.cookie,
      maxAge: parseInt(config.jwt.accessTokenExpiry) * 60 * 1000 // Convert minutes to milliseconds
    });
  
    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, config.cookie);
};

const clearCookies = (res: Response): void => {
    res.clearCookie('accessToken', {
        ...config.cookie,
        maxAge: 0
    });

    res.clearCookie('refreshToken', {
        ...config.cookie,
        maxAge: 0
    });
}


const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, config.jwt.accessTokenSecret) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid access token');
    }
}

const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, config.jwt.refreshTokenSecret) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}


const findUserByRefreshToken = async (refreshToken: string) => {
    return await User.findOne({ refreshToken });
}

const removeRefreshToken = async (userId: Types.ObjectId): Promise<void> => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
}

export default {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    setCookies,
    clearCookies,
    verifyAccessToken,
    verifyRefreshToken,
    findUserByRefreshToken,
    removeRefreshToken
};