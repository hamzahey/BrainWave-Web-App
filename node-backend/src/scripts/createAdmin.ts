import mongoose from 'mongoose';
import User from '../models/user.model';
import { UserRole } from '../models/interfaces/user.interface';
import config from '../config/config';
import logger from '../utils/logger';



const createAdminUser = async (): Promise<void> => {
    try{
        console.log(config.database.url);
        await mongoose.connect(config.database.url as string);
        logger.info('Connected to MongoDB for admin creation');

        const adminExists = await User.findOne({role: UserRole.ADMIN});

        if(adminExists){
            logger.info('Admin user already exists');
        }else {
            const admin = new User({
                email: 'admin@brainwave.com',
                password: 'Admin@123',
                firstName: 'Admin',
                lastName: 'User',
                role: UserRole.ADMIN,
            });

            await admin.save();

            logger.info('Admin user created successfully');
            logger.info(`Admin user details: ${JSON.stringify(admin)}`);
        }

        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');

    }catch(error){
        logger.error("Error creating admin user", error);
    }
};

createAdminUser();