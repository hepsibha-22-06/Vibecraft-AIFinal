import { Router } from 'express';
import { analyzeQuiz } from '../controllers/quizController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/analyze', optionalAuth, analyzeQuiz);

export default router;
