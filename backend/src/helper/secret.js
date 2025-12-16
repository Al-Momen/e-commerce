import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';
const mongoUrl = process.env.MONGO_URL;
const serverPort = process.env.PORT || 3001;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpClientUrl = process.env.SMTP_CLIENT_URL;
<<<<<<< HEAD

export { jwtSecretKey, mongoUrl, serverPort,smtpHost,smtpPort,smtpUser,smtpPass,smtpClientUrl };
=======
export { jwtSecretKey, mongoUrl, serverPort, smtpHost, smtpPort, smtpUser, smtpPass, smtpClientUrl };
>>>>>>> cbbebd8f78ae9911ee9006763f85d5882671dd47
