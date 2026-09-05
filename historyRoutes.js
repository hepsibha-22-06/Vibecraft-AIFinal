import { Router } from 'express';
import {
  getHistory,
  saveHistory,
  clearHistory
} from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getHistory);
router.post('/', saveHistory);
router.delete('/', clearHistory);

export default router;
