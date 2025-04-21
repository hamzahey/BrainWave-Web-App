import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgran from 'morgan';
import errorHandler from './utils/errorHandler';

import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgran('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;