//-------------App Configure here ------------------
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/global/errors/errorHandler.js';
import { notFound } from './middleware/global/errors/notFound.js';
import { rootRouter } from './routes/root.js';
import userRouter from './routes/user.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes (bind or attach) to main this app instance
app.use('/api', rootRouter);
app.use('/api/user', userRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
