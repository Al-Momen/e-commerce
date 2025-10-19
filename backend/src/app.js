import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'
import { isLoggedIn, isLoggedIn2 } from './middleware/login.js';

const app = express();


const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 500, // 1 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: 'Toom many request', // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// app.use(rateLimiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', [isLoggedIn, isLoggedIn2], (req, res) => {
  res.send('Hello World from Node.js!');
});

app.post('/test', [isLoggedIn, isLoggedIn2,rateLimiter], (req, res) => {
  res.status(200).json({ message: 'Api is connect' });
});

// Client Error Handling
app.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
})

//Server Error Handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server Error';

  res.status(status).json({
    success: false,
    status,
    message
  });

})

export default app;
