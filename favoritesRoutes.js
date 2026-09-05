import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from '../controllers/favoritesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

export default router;
