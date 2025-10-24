import mongoose from "mongoose";
const mongoUrl = process.env.MONGO_URL;
// "dev": "node --env-file=backend/.env --watch index.js"

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}, Url: ${mongoUrl}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDatabase;