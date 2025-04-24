import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './utils/errorHandler';
import config from './config/config';
import authRoutes from './routes/auth.routes';

const app: Application = express();

// Make sure this is before any routes
app.use(cors({
    origin: true, // Allow any origin but respect the Origin header
    credentials: true
}));

// Add this line after CORS configuration
app.use(cookieParser()); // You imported cookieParser but didn't use it
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;