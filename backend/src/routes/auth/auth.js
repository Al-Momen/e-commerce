import express from "express";
import authController from "../../controllers/user/auth/authController.js";

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/verify', authController.verify);

export default authRouter;