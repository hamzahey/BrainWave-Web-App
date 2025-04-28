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
    },
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: '/', // Make sure this is set
    },
    clientUrl: 'http://localhost:3000',
}