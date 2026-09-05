import { supabaseService } from '../services/supabaseService.js';

export async function getFavorites(req, res, next) {
  try {
    const favorites = await supabaseService.getFavorites(req.user.id, req.token);
    return res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const activity = req.body;
    if (!activity || !activity.title) {
      return res.status(400).json({ success: false, message: 'Valid activity object is required.' });
    }

    const saved = await supabaseService.addFavorite(req.user.id, activity, req.token);
    return res.status(201).json({
      success: true,
      data: saved,
      message: 'Activity saved to favorites'
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { id } = req.params;
    await supabaseService.removeFavorite(req.user.id, id, req.token);
    return res.status(200).json({
      success: true,
      message: 'Activity removed from favorites'
    });
  } catch (error) {
    next(error);
  }
}
