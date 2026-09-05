import React, { useState, useMemo } from 'react';
import { Heart, Search, Filter, Play, Trash2, Share2, Sparkles, Clock, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function FavoritesPage({
  favorites = [],
  onRemoveFavorite,
  onStartActivity,
  onShareActivity,
  onOpenGenerator
}) {
  const { user, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedSetting, setSelectedSetting] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const vibes = ['All', 'Casual', 'Professional', 'Energetic', 'Creative', 'Relaxed'];
  const settings = ['All', 'Remote', 'In-person', 'Hybrid'];

  const filtered = useMemo(() => {
    return favorites
      .filter((act) => {
        if (!act || !act.title) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = act.title.toLowerCase().includes(q);
          const matchDesc = (act.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }
        if (selectedVibe !== 'All' && act.vibe?.toLowerCase() !== selectedVibe.toLowerCase()) {
          return false;
        }
        if (selectedSetting !== 'All' && act.setting !== 'All' && act.setting?.toLowerCase() !== selectedSetting.toLowerCase()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'duration') return (a.duration_minutes || 0) - (b.duration_minutes || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
  }, [favorites, searchQuery, selectedVibe, selectedSetting, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-current" />
            <span>Saved Favorites</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Your personal facilitation vault of tried-and-true team building activities.
          </p>
        </div>

        <button
          onClick={onOpenGenerator}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 self-start"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate More</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      {favorites.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved activities..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Vibe Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Vibe:</span>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="text-xs font-semibold py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              {vibes.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Setting Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Setting:</span>
            <select
              value={selectedSetting}
              onChange={(e) => setSelectedSetting(e.target.value)}
              className="text-xs font-semibold py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              {settings.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold py-2 px-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              <option value="newest">Recently Saved</option>
              <option value="duration">Shortest First</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((activity) => (
            <div
              key={activity.favorite_id || activity.id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 flex flex-col justify-between hover:border-brand-200 transition-all"
            >
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700">
                    {activity.activity_type}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-slate-400" />
                    <span>{activity.setting}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activity.duration_minutes}m</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activity.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onStartActivity(activity)}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>

                <button
                  onClick={() => onShareActivity(activity)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRemoveFavorite(activity.id || activity.activity_id || activity.favorite_id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {searchQuery ? 'No matching favorites found' : 'No favorites yet'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try changing your search terms or filter selections.'
              : 'Save an activity using the heart icon on any generated card and it will be stored securely in your vault.'}
          </p>
          <div className="mt-5">
            <button
              onClick={onOpenGenerator}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
            >
              Generate Activities Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
