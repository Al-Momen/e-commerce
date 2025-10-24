import express from 'express';
import rateLimiter from '../middleware/global/ratelimiter.js';
import { isLoggedIn, isLoggedIn2 } from '../middleware/auth/login.js';
import siteController from '../controllers/frontend/siteController.js';
const rootRouter = express.Router();

rootRouter.get('/', [isLoggedIn, isLoggedIn2], siteController.home);
rootRouter.post('/test', [isLoggedIn, isLoggedIn2,rateLimiter], siteController.test);

export {rootRouter};
