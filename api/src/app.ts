import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRouter from './routes/auth.routes';
import walletRouter from './routes/wallet.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow the web origin
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);

// Body parsing with strict payload limit (Protection against DoS / Buffer Overflows)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
