import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRouter from './routes/auth.routes';
import walletRouter from './routes/wallet.routes';
import serviceRequestsRouter from './routes/serviceRequest.routes';
import lostFoundRouter from './routes/lostFound.routes';
import canteenRouter from './routes/canteen.routes';
import carpoolRouter from './routes/carpool.routes';
import parcelRouter from './routes/parcel.routes';
import marketplaceRouter from './routes/marketplace.routes';
import hostelRouter from './routes/hostel.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow the web origin
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
  })
);

// Body parsing with relaxed limit for image uploads and OCR payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/service-requests', serviceRequestsRouter);
app.use('/api/lost-found', lostFoundRouter);
app.use('/api/canteen', canteenRouter);
app.use('/api/carpool', carpoolRouter);
app.use('/api/parcels', parcelRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/hostel', hostelRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
