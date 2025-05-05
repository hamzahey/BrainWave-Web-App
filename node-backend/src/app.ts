import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './utils/errorHandler';
import config from './config/config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes'
import analysisRoutes from './routes/analysis.routes';

const app: Application = express();

// Make sure this is before any routes
app.use(cors({
    origin: config.clientUrl, // Your frontend URL
    credentials: true, // Critical for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this line after CORS configuration
app.use(cookieParser()); // You imported cookieParser but didn't use it
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analysis', analysisRoutes);

app.use(errorHandler);

export default app;