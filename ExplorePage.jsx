import React, { useState, useEffect, useMemo } from 'react';
import { Search, Compass, Filter, Play, Heart, Share2, Printer, Clock, Monitor } from 'lucide-react';
import { apiService } from '../services/api';

export function ExplorePage({
  onStartActivity,
  onToggleFavorite,
  isFavorited,
  onShareActivity,
  onPrintActivity
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [vibeFilter, setVibeFilter] = useState('All');
  const [settingFilter, setSettingFilter] = useState('All');

  const types = ['All', 'Icebreaker', 'Team Building', 'Trivia', 'Quick Game', 'Conversation Starter'];
  const vibes = ['All', 'Casual', 'Professional', 'Energetic', 'Creative', 'Relaxed'];
  const settings = ['All', 'Remote', 'In-person', 'Hybrid'];

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const res = await apiService.getActivities({ limit: 50 });
      if (res.data) setActivities(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return activities.filter((act) => {
      if (search) {
        const q = search.toLowerCase();
        const matches = act.title.toLowerCase().includes(q) || act.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (typeFilter !== 'All' && act.activity_type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }
      if (vibeFilter !== 'All' && act.vibe.toLowerCase() !== vibeFilter.toLowerCase()) {
        return false;
      }
      if (settingFilter !== 'All' && act.setting !== 'All' && act.setting.toLowerCase() !== settingFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [activities, search, typeFilter, vibeFilter, settingFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-brand-600" />
          <span>Curated Activity Library</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Browse our complete catalog of 40+ production-tested team activities, games, and conversation rituals.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities by name, keyword, or mechanic..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-bold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={vibeFilter}
            onChange={(e) => setVibeFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Vibes</option>
            {vibes.filter(v => v !== 'All').map(v => <option key={v} value={v}>{v}</option>)}
          </select>

          <select
            value={settingFilter}
            onChange={(e) => setSettingFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Settings</option>
            {settings.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(search || typeFilter !== 'All' || vibeFilter !== 'All' || settingFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('All');
                setVibeFilter('All');
                setSettingFilter('All');
              }}
              className="ml-auto text-brand-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading activity catalog...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 flex flex-col justify-between hover:border-brand-200 hover:shadow-glow/10 transition-all"
            >
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                    {activity.activity_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                    {activity.vibe}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-slate-400" />
                    <span>{activity.setting}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activity.duration_minutes}m</span>
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activity.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
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
                  onClick={() => onToggleFavorite(activity)}
                  className={`p-2 rounded-xl border transition-all ${
                    isFavorited(activity.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-600'
                  }`}
                  title="Save to favorites"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited(activity.id) ? 'fill-current text-rose-500' : ''}`} />
                </button>

                <button
                  onClick={() => onShareActivity(activity)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onPrintActivity(activity)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200"
                  title="Print / Export"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <h3 className="text-base font-bold text-slate-700">No activities match your filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or loosening your filters.</p>
        </div>
      )}
    </div>
  );
}
