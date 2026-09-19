import { Router } from 'express';
import { getDashboardSummary } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/dashboard', protect, adminOnly, getDashboardSummary);

export default router;
