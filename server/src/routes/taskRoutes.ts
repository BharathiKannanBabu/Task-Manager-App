import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleSubtask,
  reorderKanbanTasks,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:taskId/subtasks/:subtaskId', toggleSubtask);
router.post('/reorder', reorderKanbanTasks);

export default router;
