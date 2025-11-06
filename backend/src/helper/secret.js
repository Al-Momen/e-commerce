import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';
const mongoUrl = process.env.MONGO_URL;
const serverPort = process.env.PORT || 3001;
export { jwtSecretKey, mongoUrl, serverPort };