import { Router } from 'express';
import { createPet, deletePet, getPetById, getPets, updatePet } from '../controllers/petController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getPets).post(protect, adminOnly, createPet);
router.route('/:id').get(getPetById).put(protect, adminOnly, updatePet).delete(protect, adminOnly, deletePet);

export default router;
