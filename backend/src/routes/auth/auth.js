import express from "express";
import rateLimiter from '../../middleware/global/ratelimiter.js';
import authController from "../../controllers/user/auth/authController.js";

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.get('/activate/:token', authController.verify);
authRouter.post('/login',rateLimiter, authController.login);

authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/verify-otp', rateLimiter, authController.verifyOtp);
authRouter.post('/reset-password', rateLimiter, authController.resetPassword);


export default authRouter;