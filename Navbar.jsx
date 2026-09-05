import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  History,
  Users,
  Brain,
  Gamepad2,
  Dice5,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
  Compass,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ currentView, setCurrentView, favoritesCount = 0, onOpenSurprise, savedTeams = [], onSelectTeam }) {
  const { user, signOut, openAuthModal, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teamsDropdownOpen, setTeamsDropdownOpen] = useState(false);

  const navItems = [
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'explore', label: 'Explore 40+', icon: Compass },
    { id: 'quiz', label: 'Vibe Quiz', icon: Brain },
    { id: 'trivia', label: 'Trivia Arena', icon: Gamepad2 },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'history', label: 'History', icon: History },
    { id: 'teams', label: 'My Teams', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('generator')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  VIBECRAFT <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-brand-100 text-brand-700 tracking-wide">AI</span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-tight leading-none">
                  Turn awkward silence into connection
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-rose-100 text-rose-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Surprise Me CTA */}
            <button
              onClick={onOpenSurprise}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors shadow-sm"
              title="Pick a random surprise activity"
            >
              <Dice5 className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Surprise Me</span>
            </button>

            {/* Saved Teams dropdown quick picker */}
            {savedTeams.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setTeamsDropdownOpen(!teamsDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Teams ({savedTeams.length})</span>
                </button>
                {teamsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Quick Load Team
                    </div>
                    {savedTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => {
                          onSelectTeam(team);
                          setTeamsDropdownOpen(false);
                          setCurrentView('generator');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
                      >
                        <span className="truncate">{team.team_name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{team.team_size}p</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          setCurrentView('teams');
                          setTeamsDropdownOpen(false);
                        }}
                        className="w-full text-center py-1 text-xs text-brand-600 font-bold hover:underline"
                      >
                        Manage Teams →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Auth Info */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200 overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.user_metadata?.full_name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none">
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => demoLogin('Team Lead')}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="One-click demo sign-in for testing"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Login</span>
                </button>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenSurprise}
              className="p-1.5 text-amber-600 bg-amber-50 rounded-lg border border-amber-200"
            >
              <Dice5 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-5 space-y-1 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    demoLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl"
                >
                  ⚡ Demo Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold bg-brand-600 text-white rounded-xl"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
