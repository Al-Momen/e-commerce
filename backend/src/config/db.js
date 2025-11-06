import mongoose from "mongoose";
import {mongoUrl} from "../helper/secret.js";

if (!mongoUrl) {
    console.error("MongoDB Connection Error: MONGO_URL not defined in environment variables.");
    process.exit(1);
}
// "dev": "nodemon --env-file=backend/.env index.js"
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