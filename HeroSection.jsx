import React from 'react';
import { Sparkles, Dice5, Brain, ArrowDown, Users, Flame, Coffee, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection({ onScrollToGenerator, onOpenSurprise, onOpenQuiz, onApplyPreset }) {
  const demoPresets = [
    {
      title: 'Monday Morning Sync',
      icon: Coffee,
      badge: 'Hybrid • Casual',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200/80',
      data: { team_size: '6-10', setting: 'Hybrid', vibe: 'Casual', activity_type: 'Icebreaker', duration_minutes: 10 }
    },
    {
      title: 'Remote Sprint Retro',
      icon: Sparkles,
      badge: 'Remote • Creative',
      color: 'from-purple-500/10 to-indigo-500/10 text-brand-700 border-brand-200/80',
      data: { team_size: '6-10', setting: 'Remote', vibe: 'Creative', activity_type: 'Team Building', duration_minutes: 15 }
    },
    {
      title: 'All-Hands Energizer',
      icon: Flame,
      badge: 'In-person • High Energy',
      color: 'from-rose-500/10 to-pink-500/10 text-rose-700 border-rose-200/80',
      data: { team_size: '21-50', setting: 'In-person', vibe: 'Energetic', activity_type: 'Quick Game', duration_minutes: 8 }
    },
    {
      title: 'New Hire 1-on-1 / Small Pod',
      icon: Users,
      badge: 'All • Relaxed',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200/80',
      data: { team_size: '2-5', setting: 'Hybrid', vibe: 'Relaxed', activity_type: 'Conversation Starter', duration_minutes: 10 }
    }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-gradient-to-b from-brand-50/60 via-slate-50 to-slate-50 border-b border-slate-200/60">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl">
        <div className="w-96 h-96 rounded-full bg-brand-400/30 absolute -top-10 left-1/4 animate-pulse-subtle" />
        <div className="w-80 h-80 rounded-full bg-indigo-300/30 absolute top-10 right-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-bold mb-6 border border-brand-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin-slow" />
            <span>Generative AI Icebreaker & Team Activity Engine</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
          >
            Turn awkward silence into{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-coral-500 bg-clip-text text-transparent">
              meaningful connection.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Instantly generate psychological-safe icebreakers, high-energy games, team challenges, and trivia calibrated to your exact team size, setting, and vibe.
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={onScrollToGenerator}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create an Activity</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={onOpenSurprise}
              className="px-5 py-3.5 rounded-xl bg-white border-2 border-amber-300 text-amber-900 font-bold text-sm shadow-sm hover:bg-amber-50/80 hover:border-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Dice5 className="w-5 h-5 text-amber-600" />
              <span>🎲 Surprise Me</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-5 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Team Vibe Quiz</span>
            </button>
          </motion.div>
        </div>

        {/* 1-Click Fast Presets (Designed for instant 2-minute judging demo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-slate-200/60"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>⚡ Fast Demo Presets</span>
              <span className="text-[10px] font-medium text-slate-400 font-normal">
                (1-Click to pre-fill generator)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {demoPresets.map((preset, index) => {
              const Icon = preset.icon;
              return (
                <button
                  key={index}
                  onClick={() => onApplyPreset(preset.data)}
                  className={`p-3.5 rounded-xl border bg-gradient-to-br ${preset.color} hover:scale-[1.02] active:scale-[0.98] transition-all text-left group flex flex-col justify-between shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-white/80 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70">
                      {preset.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold group-hover:underline">
                      {preset.title}
                    </h4>
                    <span className="text-[11px] opacity-80 mt-0.5 block">
                      {preset.data.duration_minutes}m • {preset.data.activity_type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
