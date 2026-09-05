import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dice5, Sparkles, Play, Heart, RotateCw, Monitor, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export function SurpriseMeModal({ isOpen, onClose, onStartActivity, onToggleFavorite, isFavorited }) {
  const [loading, setLoading] = useState(false);
  const [surpriseActivity, setSurpriseActivity] = useState(null);
  const [settingFilter, setSettingFilter] = useState('All');
  const [vibeFilter, setVibeFilter] = useState('All');
  const { error: toastError, info } = useToast();

  if (!isOpen) return null;

  const rollSurprise = async () => {
    setLoading(true);
    setSurpriseActivity(null);
    try {
      // Simulate 450ms slot roll animation
      const [res] = await Promise.all([
        apiService.surpriseMe({ setting: settingFilter, vibe: vibeFilter }),
        new Promise((r) => setTimeout(r, 450))
      ]);
      if (res.data) {
        setSurpriseActivity(res.data);
      }
    } catch (err) {
      toastError('Failed to fetch surprise. Try rolling again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1 text-amber-100 text-xs font-black uppercase tracking-wider">
              <Dice5 className="w-4 h-4 animate-spin-slow" />
              <span>Instant Serendipity</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">🎲 SURPRISE ME!</h2>
            <p className="text-xs text-amber-50 mt-1">
              Skip the decision paralysis. Let VibeCraft AI pick an unexpected team activity for your moment.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Preference Bias Bar */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Setting Bias
                </label>
                <select
                  value={settingFilter}
                  onChange={(e) => setSettingFilter(e.target.value)}
                  className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                >
                  <option value="All">Any Setting (Random)</option>
                  <option value="Remote">Remote</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Vibe Bias
                </label>
                <select
                  value={vibeFilter}
                  onChange={(e) => setVibeFilter(e.target.value)}
                  className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 focus:outline-none"
                >
                  <option value="All">Any Vibe (Wildcard)</option>
                  <option value="Casual">Casual</option>
                  <option value="Energetic">Energetic</option>
                  <option value="Creative">Creative</option>
                  <option value="Relaxed">Relaxed</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>

            {/* Display Area: Either Roll CTA or Activity Card */}
            {loading ? (
              <div className="py-12 text-center space-y-3">
                <motion.div
                  animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30"
                >
                  <Dice5 className="w-9 h-9" />
                </motion.div>
                <div className="text-sm font-bold text-slate-800">
                  Rolling the dice of team connection...
                </div>
                <div className="text-xs text-slate-400">
                  Selecting the ultimate surprise activity
                </div>
              </div>
            ) : surpriseActivity ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 border border-amber-200 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {surpriseActivity.activity_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    {surpriseActivity.vibe}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    <span>{surpriseActivity.setting}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{surpriseActivity.duration_minutes}m</span>
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {surpriseActivity.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {surpriseActivity.description}
                </p>

                {surpriseActivity.why_it_works && (
                  <div className="mt-3 p-3 rounded-xl bg-white/90 border border-amber-200/60 text-xs text-slate-700">
                    <strong className="font-bold text-amber-900">Why it works: </strong>
                    <span>{surpriseActivity.why_it_works}</span>
                  </div>
                )}

                <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onStartActivity(surpriseActivity);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Activity</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(surpriseActivity)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isFavorited(surpriseActivity.id)
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600'
                    }`}
                    title="Save to favorites"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited(surpriseActivity.id) ? 'fill-current text-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={rollSurprise}
                    className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Roll Again</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <button
                  onClick={rollSurprise}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:scale-105 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 mx-auto"
                >
                  <Dice5 className="w-6 h-6" />
                  <span>Click to Roll the Dice!</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
