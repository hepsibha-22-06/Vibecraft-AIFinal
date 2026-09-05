import React, { useState } from 'react';
import { History, Trash2, Calendar, Users, Monitor, Flame, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function HistoryPage({
  history = [],
  onClearHistory,
  onReopenGeneration,
  onOpenGenerator
}) {
  const { user, openAuthModal } = useAuth();
  const { success } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleConfirmClear = async () => {
    await onClearHistory();
    setShowClearConfirm(false);
    success('Generation history cleared.');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-brand-600" />
            <span>Generation History</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Log of your team building activity prompts and generated suggestion batches.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Clear All Generation History?
            </h3>
            <p className="text-xs text-slate-500">
              This will remove all recorded past activity generation batches from your account. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => {
            const activities = Array.isArray(record.generated_activities)
              ? record.generated_activities
              : [];

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 hover:border-brand-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(record.created_at)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                      {record.activity_type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{record.team_size}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-slate-400" />
                      <span>{record.setting}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-purple-500" />
                      <span>{record.vibe}</span>
                    </span>
                  </div>
                </div>

                {/* Generated activity cards snippets */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {activities.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
                    >
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-brand-600">
                        {act.duration_minutes}m • {act.difficulty || 'Easy'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Re-open action button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onReopenGeneration(activities, record)}
                    className="py-1.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Re-open this Batch in Generator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No generation history yet</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Whenever you generate activities, your results are automatically saved here so you can review and reuse past ideas.
          </p>
          <div className="mt-5">
            <button
              onClick={onOpenGenerator}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
            >
              Generate Your First Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
