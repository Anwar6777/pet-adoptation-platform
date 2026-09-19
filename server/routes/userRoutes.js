import { Router } from 'express';
import { getUserById, getUsers, updateUser } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, adminOnly, getUsers);
router.route('/:id').get(protect, getUserById).put(protect, updateUser);

export default router;
