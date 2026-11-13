import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);

export default router;
