import React, { useState } from 'react';
import {
  Heart,
  Play,
  RotateCw,
  Share2,
  Clock,
  Users,
  Monitor,
  Flame,
  Lightbulb,
  Check,
  Printer
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityCard({
  activity,
  isFavorite = false,
  onToggleFavorite,
  onStart,
  onRegenerate,
  onShare,
  onPrint
}) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenClick = async () => {
    if (!onRegenerate || isRegenerating) return;
    setIsRegenerating(true);
    try {
      await onRegenerate(activity);
    } finally {
      setIsRegenerating(false);
    }
  };

  const getVibeBadgeColor = (vibe) => {
    switch (vibe?.toLowerCase()) {
      case 'energetic':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'creative':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'relaxed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'hard':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-glow/15 hover:border-brand-300 transition-all border border-slate-200/80 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top badges bar */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {/* Type Badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60">
            {activity.activity_type || 'Icebreaker'}
          </span>

          {/* Vibe Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getVibeBadgeColor(activity.vibe)}`}>
            {activity.vibe || 'Casual'}
          </span>

          {/* Setting Badge */}
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200/60">
            <Monitor className="w-3 h-3 text-slate-500" />
            <span>{activity.setting || 'Hybrid'}</span>
          </span>

          {/* Duration Badge */}
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200/60">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activity.duration_minutes || 10}m</span>
          </span>

          {/* Difficulty Badge */}
          <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getDifficultyBadge(activity.difficulty)}`}>
            {activity.difficulty || 'Easy'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-brand-600 transition-colors">
          {activity.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
          {activity.description}
        </p>

        {/* Why it works callout */}
        {activity.why_it_works && (
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-amber-100 text-amber-700 mt-0.5 flex-shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="font-bold text-slate-800">Why it works: </strong>
              <span>{activity.why_it_works}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Start / Play Button */}
        <button
          onClick={() => onStart(activity)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Activity</span>
        </button>

        <div className="flex items-center gap-1">
          {/* Save / Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(activity)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label="Favorite activity"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
          </button>

          {/* Regenerate Button */}
          {onRegenerate && (
            <button
              onClick={handleRegenClick}
              disabled={isRegenerating}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors disabled:opacity-50"
              title="Regenerate this specific activity"
              aria-label="Regenerate activity"
            >
              <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-brand-600' : ''}`} />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={() => onShare(activity)}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors"
            title="Share activity"
            aria-label="Share activity"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Export / Print Button */}
          <button
            onClick={() => onPrint(activity)}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Export / Print"
            aria-label="Export activity"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
