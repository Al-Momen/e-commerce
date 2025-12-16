import express from 'express';
import rateLimiter from '../middleware/global/ratelimiter.js';
import UserController from '../controllers/user/userController.js';
const userRouter = express.Router();

userRouter.use(rateLimiter);

userRouter.get('/index', UserController.index);
userRouter.post('/create', UserController.create);
userRouter.get('/edit/:id', UserController.edit);
userRouter.delete('/delete/:id', UserController.delete);
<<<<<<< HEAD
userRouter.post('/register', UserController.register);
userRouter.post('/verify', UserController.verify);
userRouter.post('/user-update-data/:id', UserController.userUpdateData);
=======
>>>>>>> cbbebd8f78ae9911ee9006763f85d5882671dd47

export default userRouter;