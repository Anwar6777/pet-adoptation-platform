import { Router } from 'express';
import { cancelAdoptionRequest, createAdoptionRequest, getAllAdoptionRequests, getMyAdoptionRequests, updateAdoptionStatus } from '../controllers/adoptionController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createAdoptionRequest);
router.get('/my', protect, getMyAdoptionRequests);
router.get('/', protect, adminOnly, getAllAdoptionRequests);
router.put('/:id/status', protect, adminOnly, updateAdoptionStatus);
router.delete('/:id', protect, cancelAdoptionRequest);

export default router;
