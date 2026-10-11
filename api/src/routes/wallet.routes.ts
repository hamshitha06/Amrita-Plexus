import { Router } from 'express';
import { getBalance, executeTransaction } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/authenticate';
import rateLimit from 'express-rate-limit';

const router = Router();

const walletLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // max 30 wallet queries/transactions per minute per IP
  message: { error: { code: 'RATE_LIMITED', message: 'Too many wallet operations, please try again shortly' } }
});

router.use(authenticate);
router.use(walletLimiter);

router.get('/balance', getBalance);
router.post('/transact', executeTransaction);

export default router;
