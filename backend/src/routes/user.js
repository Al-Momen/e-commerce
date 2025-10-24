import express from 'express';
import rateLimiter from '../middleware/global/ratelimiter.js';
import UserController from '../controllers/user/userController.js';
const userRouter = express.Router();

userRouter.get('/index', UserController.index);
userRouter.post('/create', [rateLimiter], UserController.create);

export default userRouter;