import { supabaseService } from '../services/supabaseService.js';

export async function getHistory(req, res, next) {
  try {
    const history = await supabaseService.getHistory(req.user.id, req.token);
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
}

export async function saveHistory(req, res, next) {
  try {
    const record = req.body;
    const saved = await supabaseService.saveHistory(req.user.id, record, req.token);
    return res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    next(error);
  }
}

export async function clearHistory(req, res, next) {
  try {
    await supabaseService.clearHistory(req.user.id, req.token);
    return res.status(200).json({
      success: true,
      message: 'Generation history cleared.'
    });
  } catch (error) {
    next(error);
  }
}
