//index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { router } from './routes/faq.js';
import { errorHandler } from './middleware/errorHandler.js';
import './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// rate limiting with proper IP handling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // custom key generator to handle undefined IPs
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
  // skip rate limiting in development
  skip: () => process.env.NODE_ENV === 'development'
});
app.use(limiter);

// enable trust proxy if behind a reverse proxy
app.set('trust proxy', 1);

// Routes
app.use('/api/faqs', router);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;