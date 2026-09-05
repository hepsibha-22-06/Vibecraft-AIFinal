import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';
import { soundEffects } from '../utils/audio';

export function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    loadTrivia();
  }, []);

  const loadTrivia = async () => {
    setLoading(true);
    setGameFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    try {
      const res = await apiService.getTrivia({ count: 5 });
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correct_index;

    if (isCorrect) {
      soundEffects.playSuccessSound();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setScore((prev) => prev + 100 + nextStreak * 10);
    } else {
      soundEffects.playIncorrectSound();
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <h3 className="text-sm font-bold text-slate-700">Loading Trivia Arena...</h3>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-sm text-slate-500">Could not load trivia questions.</p>
        <button
          onClick={loadTrivia}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80 overflow-hidden">
        {/* Top Game Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Trivia Arena
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <div className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center gap-1 animate-bounce">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{streak}x Streak!</span>
              </div>
            )}
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Score</div>
              <div className="text-lg font-black text-brand-700 leading-none">{score}</div>
            </div>
          </div>
        </div>

        {/* Game Area or Final Score */}
        {!gameFinished ? (
          <div className="pt-6">
            {/* Category tag */}
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 mb-3">
              {currentQ.category}
            </div>

            {/* Question Text */}
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-6">
              {currentQ.question}
            </h3>

            {/* Choices */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct_index;

                let btnStyles = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20';
                  } else if (isSelected) {
                    btnStyles = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20';
                  } else {
                    btnStyles = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200/80 flex items-center justify-center font-bold text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next button */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-brand-50/70 border border-brand-200 space-y-3"
              >
                <div className="text-xs text-brand-900 leading-relaxed font-medium">
                  <strong className="font-bold">Fact Behind It: </strong>
                  {currentQ.explanation}
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Final Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          /* Final Results Screen */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 text-center space-y-5"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Trivia Session Complete!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your team racked up intellectual glory and trivia bragging rights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-400 font-bold">Total Points</div>
                <div className="text-2xl font-black text-brand-600 mt-1">{score}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-400 font-bold">Max Streak</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{maxStreak}x</div>
              </div>
            </div>

            <button
              onClick={loadTrivia}
              className="py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-brand-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Trivia Round</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
