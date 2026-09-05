import { aiService } from '../services/aiService.js';
import { fallbackService } from '../services/fallbackService.js';
import { supabaseService } from '../services/supabaseService.js';
import { validateGeneratePayload } from '../utils/validator.js';

export async function generateActivities(req, res, next) {
  try {
    const { data } = validateGeneratePayload(req.body);
    const result = await aiService.generateActivities(data);

    // If user is authenticated, automatically log to generation_history
    if (req.user && result.activities && result.activities.length > 0) {
      try {
        await supabaseService.saveHistory(req.user.id, {
          team_size: data.team_size,
          setting: data.setting,
          vibe: data.vibe,
          activity_type: data.activity_type,
          generated_activities: result.activities
        }, req.token);
      } catch (logErr) {
        console.warn('[ActivityController] Failed to auto-log history:', logErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: result.activities,
      source: result.source,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

export async function surpriseMe(req, res, next) {
  try {
    const { setting = 'All', vibe = 'All', exclude_titles = [] } = req.body;
    const result = await aiService.surpriseMe({ setting, vibe, exclude_titles });
    return res.status(200).json({
      success: true,
      data: result.activity,
      source: result.source
    });
  } catch (error) {
    next(error);
  }
}

export async function regenerateActivity(req, res, next) {
  try {
    const { team_size, setting, vibe, activity_type, exclude_titles = [] } = req.body;
    // Generate 1 new distinct activity excluding existing titles
    const result = await aiService.generateActivities({
      team_size,
      setting,
      vibe,
      activity_type,
      duration_minutes: 15,
      exclude_titles
    });

    const replacement = result.activities && result.activities[0] 
      ? result.activities[0]
      : fallbackService.regenerateActivity({ team_size, setting, vibe, activity_type, exclude_titles });

    return res.status(200).json({
      success: true,
      data: replacement,
      source: result.source
    });
  } catch (error) {
    next(error);
  }
}

export async function getActivities(req, res, next) {
  try {
    const { q, type, vibe, setting, limit } = req.query;
    const list = await supabaseService.getActivities({
      query: q,
      type,
      vibe,
      setting,
      limit: Number(limit) || 40
    });
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
}

export async function getActivityById(req, res, next) {
  try {
    const { id } = req.params;
    const activities = await supabaseService.getActivities({ limit: 100 });
    const activity = activities.find(a => a.id === id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    return res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
}
