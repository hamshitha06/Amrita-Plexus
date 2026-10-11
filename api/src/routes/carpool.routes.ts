import { Router } from 'express';
import {
  getRides,
  createRide,
  bookRide,
  getMyRides,
} from '../controllers/carpool.controller';

const router = Router();

router.get('/rides', getRides);
router.post('/rides', createRide);
router.post('/rides/:id/book', bookRide);
router.get('/my-rides', getMyRides);

export default router;
