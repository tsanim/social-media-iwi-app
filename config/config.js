import dotenv from 'dotenv';
dotenv.config();

export default {
    development: {
        port: process.env.PORT || 9999,
        mongoUrl: process.env.DB_URI,
        defaultUserImage: '61e050d36820ca4becd21d2b',
        JWT_SECRET: process.env.JWT_SECRET,
        socketPORT: 8888
    },
    production: {
        port: process.env.PORT,
        mongoUrl: process.env.PROD_MONGODB,
        defaultUserImage: '61e050d36820ca4becd21d2b',
        JWT_SECRET: process.env.JWT_SECRET,
        socketPORT: 8888
    }
}