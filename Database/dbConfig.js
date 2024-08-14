import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {

    try {
        const connection = await mongoose.connect(process.env.mongoDBConnectionString)
        console.log("MongoDB connected");
        return connection;
    }
    catch {
        console.log('Error in connecting to database')
    }
}

export default connectDb;   