// db.js

const mongoose = require('mongoose');
require('dotenv').config();
// MongoDB URI (replace with your actual credentials)
const MONGO_URI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the application if the connection fails
    }
};

// Export the connectDB function
module.exports = connectDB;
