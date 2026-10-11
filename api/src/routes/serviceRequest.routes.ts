import { Router } from 'express';
import {
  getMyRequests,
  getIncomingRequests,
  createServiceRequest,
  cancelServiceRequest,
  updateServiceRequestStatus,
} from '../controllers/serviceRequest.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Routes
router.get('/my-requests', authenticate, getMyRequests);
router.get('/incoming', authenticate, getIncomingRequests);
router.post('/', authenticate, createServiceRequest);
router.patch('/:id/cancel', authenticate, cancelServiceRequest);
router.patch('/:id/status', authenticate, updateServiceRequestStatus);

export default router;
