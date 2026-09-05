import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    resetPassword,
    demoLogin,
    isSupabaseConfigured
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (authModalView === 'signin') {
        await signIn(email, password);
      } else if (authModalView === 'signup') {
        await signUp(email, password, fullName);
      } else if (authModalView === 'forgot') {
        await resetPassword(email);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-6 text-white relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-xl">VIBECRAFT AI</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {authModalView === 'signin' && 'Sign in to your account'}
              {authModalView === 'signup' && 'Create your facilitator account'}
              {authModalView === 'forgot' && 'Reset your password'}
            </h3>
            <p className="text-xs text-brand-100 mt-1">
              Save custom teams, build your favorite activity deck, and track history.
            </p>
          </div>

          {/* Quick Demo Login Option */}
          <div className="p-6 pb-2">
            <button
              type="button"
              onClick={() => demoLogin('Senior Team Lead')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-2 shadow-sm transition-all group"
            >
              <Zap className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>⚡ 1-Click Demo Sign In (Evaluator Mode)</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">Or use email</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                {errorMsg}
              </div>
            )}

            {authModalView === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Chen"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>
            </div>

            {authModalView !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {authModalView === 'signin' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-[11px] font-semibold text-brand-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalView === 'signin' && 'Sign In'}
                    {authModalView === 'signup' && 'Create Account'}
                    {authModalView === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Toggle view links */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              {authModalView === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {!isSupabaseConfigured && (
              <div className="text-[11px] text-center text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-200">
                🔒 Supabase in development fallback mode. All credentials stored safely in local test session.
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
