import mongoose from 'mongoose';

const connectDB = async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/ChatService';
    if(!url) {
        throw new Error('MongoDB connection string is not defined in environment variables');
    }
    try {
        await mongoose.connect(url, {
            dbName: "ChatService",
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Fail to connect to MongoDB:', error);
        process.exit(1); 
    }
}

export default connectDB;