import app from './src/app';
import config from './src/config/config';
import connectDatabase from './src/config/database';
import logger from './src/utils/logger';

connectDatabase()
.then(() => {
    const PORT = config.server.port;
    app.listen(PORT, ()=>{
        logger.info(`Server is running on port ${PORT}`);
    })
}).catch((error) => {
    logger.error("Failed to connect to database", error);
    process.exit(1);
});