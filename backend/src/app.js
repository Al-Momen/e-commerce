//-------------App Configure here ------------------

import express from 'express';
import morgan from 'morgan';
import { rootRouter } from './routes/rootRoute.js';
import { errorHandler } from './middleware/global/errors/errorHandler.js';
import { notFound } from './middleware/global/errors/notFound.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root routes
app.use('/api',rootRouter);

// 🧩 Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
