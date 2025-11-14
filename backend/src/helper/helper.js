import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {smtpHost,smtpPort,smtpUser,smtpPass} from './secret.js'

/**
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
const createError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    throw error;
}


/**
 * @param {object} payload 
 * @param {string} jwtSecretKey 
 * @param {object} others
 */
const createJwtWebToken = (payload, jwtSecretKey, others) => {
    if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
        createError('Payload must be a non-empty object', 400);
    }
    if (!jwtSecretKey || typeof jwtSecretKey !== 'string' || jwtSecretKey.trim() === '') {
        createError('Secret Key must be a non-empty string', 400);
    }
    if (!others || typeof others !== 'object' || Object.keys(others).length === 0) {
        createError('Options must be a non-empty object', 400);
    }
    try {
        const token = jwt.sign(payload, jwtSecretKey, others);
        return token;
    } catch (error) {
        throw error;
    }
}


// ----------------Start mail setup ----------------
const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, 
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

async function sendEmail(emailBody) {
    const mailOptions = {
        from: emailBody.from,
        to: emailBody.to,
        subject: emailBody.subject,
        text: emailBody.text,
        html: emailBody.html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully!");
        console.log("Message ID:", info.messageId);
        
    } catch (error) {
        createError(`Error sending email:, ${error.message}`, 500);
    }
}



// ----------------End mail setup ----------------

export { createError, createJwtWebToken,sendEmail };