const mongoose = require('mongoose');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
