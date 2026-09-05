import { supabaseService } from '../services/supabaseService.js';

export async function getTeams(req, res, next) {
  try {
    const teams = await supabaseService.getTeams(req.user.id, req.token);
    return res.status(200).json({
      success: true,
      data: teams
    });
  } catch (error) {
    next(error);
  }
}

export async function createTeam(req, res, next) {
  try {
    const { team_name, team_size, setting, vibe } = req.body;
    if (!team_name || !team_size) {
      return res.status(400).json({ success: false, message: 'team_name and team_size are required.' });
    }

    const created = await supabaseService.createTeam(req.user.id, {
      team_name,
      team_size,
      setting: setting || 'Hybrid',
      vibe: vibe || 'Casual'
    }, req.token);

    return res.status(201).json({
      success: true,
      data: created,
      message: 'Team saved successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeam(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await supabaseService.updateTeam(req.user.id, id, updates, req.token);
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Team updated successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;
    await supabaseService.deleteTeam(req.user.id, id, req.token);
    return res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
