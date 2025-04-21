import dotenv from 'dotenv';
dotenv.config();


export default {
    database: {
        url: process.env.MONGO_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'defaultSecret',
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'defaultSecret',
        accessTokenExpiry: '1h',
        refreshTokenExpiry: '7d'
    },
    server: {
        port: process.env.PORT
    }
}