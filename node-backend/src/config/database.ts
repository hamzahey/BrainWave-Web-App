import mongoose from 'mongoose';
import config from './config';
import logger from '../utils/logger';

const connectDatabase = async (): Promise<void> => {
    try {
        if (!config.database.url) {
            throw new Error('Database URL is not defined in the configuration.');
        }
        await mongoose.connect(config.database.url);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDatabase;