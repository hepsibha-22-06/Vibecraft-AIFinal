import { Router } from 'express';
import {
  generateActivities,
  surpriseMe,
  regenerateActivity,
  getActivities,
  getActivityById
} from '../controllers/activityController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Generation endpoints (optionalAuth allows saving history automatically if logged in)
router.post('/generate', optionalAuth, generateActivities);
router.post('/surprise', surpriseMe);
router.post('/regenerate', regenerateActivity);

// Catalog / Search endpoints
router.get('/', getActivities);
router.get('/:id', getActivityById);

export default router;
