import { Router } from 'express';
import {
  getParcels,
  registerParcel,
  acceptParcelDelivery,
  verifyDeliveryOtp,
} from '../controllers/parcel.controller';

const router = Router();

router.get('/', getParcels);
router.post('/', registerParcel);
router.post('/:id/accept', acceptParcelDelivery);
router.post('/:id/verify-otp', verifyDeliveryOtp);

export default router;
