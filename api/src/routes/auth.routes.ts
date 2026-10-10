import { Router } from 'express';
import { requestCode, verifyCode, refresh, logout, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import rateLimit from 'express-rate-limit';

const router = Router();

// 5 requests per hour per email (implemented in controller logic)
// 10 requests per hour per IP (implemented here)
const requestLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests from this IP, please try again after an hour' } }
});

const verifyLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many verification attempts from this IP' } }
});

router.post('/request-code', requestLimit, requestCode);
router.post('/verify-code', verifyLimit, verifyCode);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
