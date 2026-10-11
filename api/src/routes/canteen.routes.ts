import { Router } from 'express';
import {
  getMenus,
  publishMenu,
  getFoodRequests,
  createFoodRequest,
  updateFoodRequestStatus,
} from '../controllers/canteen.controller';

const router = Router();

// Menu endpoints
router.get('/menus', getMenus);
router.post('/menus', publishMenu);

// Peer delivery requests
router.get('/requests', getFoodRequests);
router.post('/requests', createFoodRequest);
router.patch('/requests/:id/status', updateFoodRequestStatus);

export default router;
