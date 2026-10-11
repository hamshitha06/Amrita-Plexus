import { Router } from 'express';
import {
  getMessMenu,
  updateMessMenu,
  getSnacks,
} from '../controllers/hostel.controller';

const router = Router();

router.get('/mess-menu', getMessMenu);
router.post('/mess-menu', updateMessMenu);
router.get('/snacks', getSnacks);

export default router;
