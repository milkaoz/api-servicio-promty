var dotenv = require('dotenv');
dotenv.config();
module.exports = {
    database: {
        mongoHost: process.env.MONGO_ADDR || 'localhost',
        mongoPort: process.env.MONGO_PORT || '27017',
        mongoUser: process.env.MONGO_USER || 'promtyUser',
        mongoPass: process.env.MONGO_PASS || 'pass123',
        mongoDB: process.env.MONGO_DB || 'promtyDB',
    }
};