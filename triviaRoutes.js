import { Router } from 'express';
import { getTriviaQuestions } from '../controllers/triviaController.js';

const router = Router();

router.get('/', getTriviaQuestions);

export default router;
