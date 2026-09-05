import React, { useState } from 'react';
import {
  Users,
  Monitor,
  Flame,
  Layers,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sliders
} from 'lucide-react';

export function ActivityGenerator({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  activeTeamName,
  onClearTeam
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const teamSizes = ['2-5', '6-10', '11-20', '21-50', '50+'];
  const settings = [
    { id: 'Remote', label: 'Remote', icon: '💻' },
    { id: 'In-person', label: 'In-person', icon: '🏢' },
    { id: 'Hybrid', label: 'Hybrid', icon: '🌐' }
  ];
  const vibes = [
    { id: 'Casual', label: 'Casual', emoji: '☕', desc: 'Friendly & informal' },
    { id: 'Professional', label: 'Professional', emoji: '🎯', desc: 'Alignment & polish' },
    { id: 'Energetic', label: 'Energetic', emoji: '⚡', desc: 'High energy & pace' },
    { id: 'Creative', label: 'Creative', emoji: '🎨', desc: 'Unusual & inventive' },
    { id: 'Relaxed', label: 'Relaxed', emoji: '🌿', desc: 'Low stress & calm' }
  ];
  const activityTypes = [
    { id: 'Icebreaker', label: 'Icebreaker', emoji: '🧊' },
    { id: 'Team Building', label: 'Team Building', emoji: '🤝' },
    { id: 'Trivia', label: 'Trivia', emoji: '🧠' },
    { id: 'Quick Game', label: 'Quick Game', emoji: '⚡' },
    { id: 'Conversation Starter', label: 'Conversation', emoji: '💬' }
  ];

  const handleUpdate = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      team_size: '6-10',
      setting: 'Hybrid',
      vibe: 'Casual',
      activity_type: 'Icebreaker',
      duration_minutes: 15,
      difficulty: 'Easy',
      topic: ''
    });
    if (onClearTeam) onClearTeam();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80">
      {/* Active Loaded Team banner if any */}
      {activeTeamName && (
        <div className="mb-6 px-4 py-2.5 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between text-xs text-brand-800 font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            <span>
              Configured from team profile: <strong>{activeTeamName}</strong>
            </span>
          </div>
          <button
            onClick={onClearTeam}
            className="text-brand-600 hover:text-brand-900 underline font-bold"
          >
            Reset
          </button>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
        <div className="space-y-6">
          {/* 1. Team Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>1. Team Size (People)</span>
              </label>
              <span className="text-xs font-bold text-brand-600">{formData.team_size} members</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {teamSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleUpdate('team_size', size)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.team_size === size
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Setting */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>2. Meeting Setting</span>
              </label>
              <span className="text-xs font-bold text-brand-600">{formData.setting}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {settings.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleUpdate('setting', item.id)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    formData.setting === item.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Desired Vibe */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-slate-400" />
                <span>3. Target Team Vibe</span>
              </label>
              <span className="text-xs font-bold text-brand-600">{formData.vibe}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {vibes.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => handleUpdate('vibe', v.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                    formData.vibe === v.id
                      ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-lg mb-1">{v.emoji}</div>
                  <div className="text-xs font-bold leading-tight">{v.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Activity Type */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>4. Activity Category</span>
              </label>
              <span className="text-xs font-bold text-brand-600">{formData.activity_type}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {activityTypes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => handleUpdate('activity_type', t.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    formData.activity_type === t.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Advanced Settings Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Advanced Tuning' : 'Optional Preferences (Duration, Theme, Difficulty)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
                {/* Available Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration (~{formData.duration_minutes} mins)</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="5"
                    value={formData.duration_minutes}
                    onChange={(e) => handleUpdate('duration_minutes', Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5m</span>
                    <span>15m</span>
                    <span>30m</span>
                    <span>45m</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleUpdate('difficulty', e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Easy">Easy (Zero Prep / Low Barrier)</option>
                    <option value="Medium">Medium (Engaging Challenge)</option>
                    <option value="Hard">Hard (Deep Thinking / Complex)</option>
                  </select>
                </div>

                {/* Topic / Keyword */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Topic / Special Theme
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => handleUpdate('topic', e.target.value)}
                    placeholder="e.g., Q3 Offsite, AI kickoff, New Year"
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Crafting the perfect activities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-brand-200" />
                  <span>Generate Activities</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Reset form to default"
              aria-label="Reset form"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
