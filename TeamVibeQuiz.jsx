import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Play,
  Heart,
  Flame,
  Coffee,
  Palette,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    title: 'How does your team usually start an all-hands or standup?',
    options: [
      { text: 'A minute of silence or gentle coffee sipping ☕', value: 'chill' },
      { text: 'Loud banter, jokes, and GIF spam in chat ⚡', value: 'energetic' },
      { text: 'Right to the agenda, crisp metrics and next steps 🎯', value: 'collaborative' },
      { text: 'Sharing weird weekend experiments or wild memes 🎨', value: 'creative' }
    ]
  },
  {
    id: 'q2',
    title: 'When unexpected blockers arise, what is your team’s instinct?',
    options: [
      { text: 'Huddle up and brainstorm 10 wacky out-of-the-box angles 💡', value: 'creative' },
      { text: 'Sprint fast, divide and conquer in hyper-drive mode 🚀', value: 'energetic' },
      { text: 'Stay calm, evaluate root causes methodically 🧘', value: 'chill' },
      { text: 'Organize structured workflows and align stakeholder matrices 📋', value: 'collaborative' }
    ]
  },
  {
    id: 'q3',
    title: 'What does your dream team celebration look like?',
    options: [
      { text: 'High-stakes escape room or trivia tournament duel 🏆', value: 'competitive' },
      { text: 'A relaxed sunset dinner with heartfelt gratitude toasts 🍷', value: 'chill' },
      { text: 'An open hackathon or creative collaborative showcase 🎪', value: 'creative' },
      { text: 'Fast-paced rooftop party with energetic karaoke 🎤', value: 'energetic' }
    ]
  },
  {
    id: 'q4',
    title: 'If your team had a collective mascot, what would it be?',
    options: [
      { text: 'An inquisitive chameleon or inventive octopus 🐙', value: 'creative' },
      { text: 'A high-speed cheetah or caffeinated squirrel 🐿️', value: 'energetic' },
      { text: 'A wise owl or steady sea turtle 🐢', value: 'chill' },
      { text: 'A synchronized dolphin pod or strategic wolf pack 🐬', value: 'collaborative' }
    ]
  },
  {
    id: 'q5',
    title: 'What is your primary goal for team icebreakers right now?',
    options: [
      { text: 'Waking up remote meeting fatigue and getting smiles on faces! 😄', value: 'energetic' },
      { text: 'Deepening emotional safety and honest vulnerability ❤️', value: 'chill' },
      { text: 'Stretching creative muscles and lateral brainstorming 🧠', value: 'creative' },
      { text: 'Building cross-functional empathy and smooth alignment 🤝', value: 'collaborative' }
    ]
  }
];

export function TeamVibeQuiz({ onStartActivity, onToggleFavorite, isFavorited }) {
  const { user, token } = useAuth();
  const { success } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelectOption = (questionId, val) => {
    const nextAnswers = { ...answers, [questionId]: val };
    setAnswers(nextAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishQuiz(nextAnswers);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    setAnalyzing(true);
    try {
      const res = await apiService.analyzeQuiz(finalAnswers, token);
      if (res.data) {
        setResult(res.data);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (res.data.saved) {
          success('Quiz result saved to your profile!');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];
  const progressPercent = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Quiz Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Team Vibe Diagnostic Quiz
              </h2>
              <p className="text-xs text-slate-500">
                5 rapid questions to decode your team's collective wavelength & personality archetype.
              </p>
            </div>
          </div>

          {result && (
            <button
              onClick={resetQuiz}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>

        {/* State 1: Active Questions */}
        {!result && !analyzing && (
          <div className="pt-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-brand-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Question Title */}
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug mb-5">
              {currentQ.title}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(currentQ.id, opt.value)}
                  className="w-full p-4 rounded-2xl text-left border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 hover:shadow-sm transition-all text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="mt-6 flex justify-start">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  ← Back to previous question
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 2: Analyzing Animation */}
        {analyzing && (
          <div className="py-16 text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-16 h-16 mx-auto rounded-full border-4 border-purple-200 border-t-purple-600"
            />
            <h3 className="text-lg font-bold text-slate-800">
              Decoding your team's collective frequency...
            </h3>
            <p className="text-xs text-slate-400">
              Analyzing cognitive patterns and emotional drivers
            </p>
          </div>
        )}

        {/* State 3: Quiz Result & Recommendations */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6 space-y-6"
          >
            {/* Archetype Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-brand-50 to-indigo-50 border border-purple-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-200/60 text-purple-900 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Your Team Archetype Revealed</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {result.persona.vibe_title}
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
                {result.persona.summary}
              </p>
            </div>

            {/* Curated Recommendations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Recommended Activities for Your Vibe</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.recommended_activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-brand-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-brand-700 mb-1">
                        <span>{act.activity_type}</span>
                        <span>{act.duration_minutes}m</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {act.title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {act.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1">
                      <button
                        onClick={() => onStartActivity(act)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start</span>
                      </button>
                      <button
                        onClick={() => onToggleFavorite(act)}
                        className={`p-1.5 rounded-lg border text-xs ${
                          isFavorited(act.id) ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-slate-400 bg-white border-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorited(act.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
