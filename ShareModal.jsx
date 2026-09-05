import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Link as LinkIcon, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function ShareModal({ activity, isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const { success } = useToast();

  if (!isOpen || !activity) return null;

  const shareUrl = `${window.location.origin}/?activity=${encodeURIComponent(activity.title)}`;

  const formattedText = `🎉 ${activity.title} (${activity.duration_minutes}m • ${activity.setting} • ${activity.vibe})
${activity.description}

📋 INSTRUCTIONS:
${(Array.isArray(activity.instructions) ? activity.instructions : [activity.instructions])
  .map((step, i) => `${i + 1}. ${step}`)
  .join('\n')}

💡 WHY IT WORKS:
${activity.why_it_works || 'Fosters psychological safety and active team collaboration.'}

Generated via VibeCraft AI — Turn awkward silence into meaningful connection.`;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        success('Share link copied to clipboard!');
      } else {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
        success('Full activity text copied!');
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VibeCraft AI: ${activity.title}`,
          text: activity.description,
          url: shareUrl
        });
      } catch (e) {
        // Share cancelled or not supported
      }
    } else {
      copyToClipboard(shareUrl, 'link');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>Share Facilitation Plan</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {activity.title}
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {/* Native Share button if supported */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Open System Share Menu</span>
              </button>
            )}

            {/* Direct Link Section */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Direct Activity Link</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(shareUrl, 'link')}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Formatted Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Formatted Meeting Agenda / Slack Snippet</span>
                </label>
                <button
                  onClick={() => copyToClipboard(formattedText, 'text')}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied Text' : 'Copy Full Text'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={formattedText}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono leading-relaxed select-all focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
