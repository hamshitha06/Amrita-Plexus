import { Router } from 'express';
import {
  reportLostItem,
  reportFoundItem,
  getLostFoundList,
  getMyLostFoundItems,
  getLostFoundItemDetails,
  submitOwnershipClaim,
  reportHandoverToSecurity,
  confirmSecurityCustody,
  reviewOwnershipClaim,
  confirmVerifiedReturn,
  getCustodyRecords,
} from '../controllers/lostFound.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Public listings
router.get('/', getLostFoundList);
router.get('/custody/records', authenticate, getCustodyRecords);
router.get('/mine', authenticate, getMyLostFoundItems);
router.get('/:id', getLostFoundItemDetails);

// Reporting & Actions
router.post('/lost', authenticate, reportLostItem);
router.post('/found', authenticate, reportFoundItem);
router.post('/:id/claims', authenticate, submitOwnershipClaim);
router.post('/:id/handover-report', authenticate, reportHandoverToSecurity);
router.post('/:id/confirm-custody', authenticate, confirmSecurityCustody);
router.post('/claims/:claimId/review', authenticate, reviewOwnershipClaim);
router.post('/:id/confirm-return', authenticate, confirmVerifiedReturn);

export default router;
