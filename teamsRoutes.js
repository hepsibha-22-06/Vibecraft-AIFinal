import { Router } from 'express';
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

export default router;
