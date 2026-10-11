import { Router } from 'express';
import {
  getListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/marketplace.controller';

const router = Router();

router.get('/', getListings);
router.post('/', createListing);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;
