import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.delete('/clear', clearNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
