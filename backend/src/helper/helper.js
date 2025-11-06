import jwt from 'jsonwebtoken';

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

export { createError, createJwtWebToken };