import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit3, ArrowRight, Sparkles, Monitor, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function TeamsManager({
  teams,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam,
  onApplyTeamToGenerator
}) {
  const { user, openAuthModal } = useAuth();
  const { success, error: toastError } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    team_name: '',
    team_size: '6-10',
    setting: 'Hybrid',
    vibe: 'Casual'
  });

  const teamSizes = ['2-5', '6-10', '11-20', '21-50', '50+'];
  const settings = ['Remote', 'In-person', 'Hybrid'];
  const vibes = ['Casual', 'Professional', 'Energetic', 'Creative', 'Relaxed'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.team_name.trim()) return;

    try {
      if (editingId) {
        await onUpdateTeam(editingId, formData);
        success(`Updated team "${formData.team_name}"`);
        setEditingId(null);
      } else {
        await onCreateTeam(formData);
        success(`Saved team "${formData.team_name}"`);
        setIsCreating(false);
      }
      setFormData({ team_name: '', team_size: '6-10', setting: 'Hybrid', vibe: 'Casual' });
    } catch (err) {
      toastError(err.message || 'Failed to save team');
    }
  };

  const startEdit = (team) => {
    setEditingId(team.id);
    setFormData({
      team_name: team.team_name,
      team_size: team.team_size,
      setting: team.setting,
      vibe: team.vibe
    });
    setIsCreating(true);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ team_name: '', team_size: '6-10', setting: 'Hybrid', vibe: 'Casual' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-600" />
            <span>Saved Team Profiles</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Save your recurring team rosters to auto-fill the generator in one click.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              if (!user) {
                openAuthModal('signin');
                return;
              }
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team Profile</span>
          </button>
        )}
      </div>

      {/* Team Form (Create / Edit) */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 rounded-3xl bg-white border border-brand-200 shadow-soft animate-in fade-in"
        >
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>{editingId ? 'Edit Team Profile' : 'New Team Profile'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team / Squad Name
              </label>
              <input
                type="text"
                required
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                placeholder="e.g., Growth Marketing Squad"
                className="w-full text-xs font-medium py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Size
              </label>
              <select
                value={formData.team_size}
                onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                {teamSizes.map((s) => (
                  <option key={s} value={s}>{s} members</option>
                ))}
              </select>
            </div>

            {/* Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Typical Setting
              </label>
              <select
                value={formData.setting}
                onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                {settings.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Vibe */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Vibe
              </label>
              <select
                value={formData.vibe}
                onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                {vibes.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelForm}
              className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
            >
              {editingId ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      )}

      {/* Teams Grid */}
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 flex flex-col justify-between hover:border-brand-200 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(team)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                      title="Edit team"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTeam(team.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {team.team_name}
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {team.team_size} members
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-slate-400" />
                    <span>{team.setting}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-purple-500" />
                    <span>{team.vibe}</span>
                  </span>
                </div>
              </div>

              {/* 1-Click Apply Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onApplyTeamToGenerator(team)}
                  className="w-full py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Use in Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No saved teams yet</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Save team presets like "APAC Marketing" or "Frontend Core" to auto-populate the generator instantly for every meeting.
          </p>
          <div className="mt-5">
            <button
              onClick={() => {
                if (!user) openAuthModal('signin');
                else setIsCreating(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
            >
              Create Your First Team Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
