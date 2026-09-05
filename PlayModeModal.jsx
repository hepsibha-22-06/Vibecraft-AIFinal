import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Package,
  ListOrdered,
  Sparkles,
  Trophy,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audio';

export function PlayModeModal({ activity, isOpen, onClose }) {
  if (!isOpen || !activity) return null;

  const totalSeconds = (activity.duration_minutes || 10) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft((activity.duration_minutes || 10) * 60);
    setIsActive(false);
    setCompletedSteps(new Set());
    setIsFinished(false);
  }, [activity]);

  // Countdown timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            soundEffects.playCompletionChime();
            triggerConfetti();
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    soundEffects.getContext(); // Ensure audio context unlocked
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
    setIsFinished(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFinish = () => {
    setIsFinished(true);
    setIsActive(false);
    soundEffects.playCompletionChime();
    triggerConfetti();
  };

  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const instructions = Array.isArray(activity.instructions) ? activity.instructions : [activity.instructions];
  const materials = Array.isArray(activity.materials) ? activity.materials : [activity.materials || 'None required'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              aria-label="Close play mode"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-brand-200 text-xs font-bold uppercase tracking-wider">
              <span>▶ Facilitation Mode</span>
              <span>•</span>
              <span>{activity.activity_type}</span>
              <span>•</span>
              <span>{activity.setting}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {activity.title}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-brand-100/90 leading-relaxed">
              {activity.description}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Interactive Countdown Timer */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Digital Display */}
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-center sm:justify-start gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Countdown Timer</span>
                  </div>
                  <div className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${timeLeft === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleTimer}
                  className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                    isActive
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{timeLeft < totalSeconds ? 'Resume' : 'Start Timer'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetTimer}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar line */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Materials Checklist */}
            {materials.length > 0 && materials[0] !== 'None' && materials[0] !== 'None required' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>Materials / Equipment Needed</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-amber-900/90 font-medium">
                  {materials.map((mat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Facilitation Flow */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                  <span>Step-by-Step Facilitator Guide</span>
                </h4>
                <span className="text-xs font-semibold text-brand-600">
                  {completedSteps.size} of {instructions.length} completed
                </span>
              </div>

              <div className="space-y-2.5">
                {instructions.map((step, idx) => {
                  const isDone = completedSteps.has(idx);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className={`flex-1 text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-emerald-800/80' : ''}`}>
                        {step}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion state or button */}
            {isFinished ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-2xl bg-emerald-500 text-white text-center shadow-lg animate-bounce-soft"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black">Activity Successfully Completed! 🎉</h3>
                <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
                  Awesome facilitation! Your team just broke barriers and built genuine rapport.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={triggerConfetti}
                    className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-sm hover:bg-emerald-50 transition-colors"
                  >
                    🎊 More Confetti
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Activity as Completed</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
