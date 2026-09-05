import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ActivityGenerator } from './components/ActivityGenerator';
import { ActivityCard } from './components/ActivityCard';
import { PlayModeModal } from './components/PlayModeModal';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './components/AuthModal';
import { TeamsManager } from './components/TeamsManager';
import { TeamVibeQuiz } from './components/TeamVibeQuiz';
import { TriviaGame } from './components/TriviaGame';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { ExplorePage } from './pages/ExplorePage';

import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { apiService } from './services/api';
import { Sparkles, ArrowDown, Info, ShieldCheck, Heart, Layers } from 'lucide-react';

export default function App() {
  const { user, token, openAuthModal } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [currentView, setCurrentView] = useState('generator'); // 'generator' | 'explore' | 'quiz' | 'trivia' | 'favorites' | 'history' | 'teams'
  const [activePlayActivity, setActivePlayActivity] = useState(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [shareTargetActivity, setShareTargetActivity] = useState(null);

  // Generator form state
  const [generatorForm, setGeneratorForm] = useState({
    team_size: '6-10',
    setting: 'Hybrid',
    vibe: 'Casual',
    activity_type: 'Icebreaker',
    duration_minutes: 15,
    difficulty: 'Easy',
    topic: ''
  });
  const [activeTeamName, setActiveTeamName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [generationSourceInfo, setGenerationSourceInfo] = useState('');

  // Persistent user data
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [savedTeams, setSavedTeams] = useState([]);

  // System diagnostic state
  const [systemHealth, setSystemHealth] = useState(null);

  const generatorRef = useRef(null);

  // Load initial diagnostic health & starter activities
  useEffect(() => {
    apiService.getHealth()
      .then((res) => setSystemHealth(res))
      .catch((e) => console.warn('Backend offline or health check failed:', e));

    // Load initial 4 activities so generator is instantly populated with suggestions
    handleGenerate(false);
  }, []);

  // Fetch authenticated user data (favorites, history, teams)
  useEffect(() => {
    if (user && token) {
      loadUserData();
    } else {
      setFavorites([]);
      setHistory([]);
      setSavedTeams([]);
    }
  }, [user, token]);

  const loadUserData = async () => {
    try {
      const [favsRes, histRes, teamsRes] = await Promise.allSettled([
        apiService.getFavorites(token),
        apiService.getHistory(token),
        apiService.getTeams(token)
      ]);

      if (favsRes.status === 'fulfilled' && favsRes.value.data) {
        setFavorites(favsRes.value.data);
      }
      if (histRes.status === 'fulfilled' && histRes.value.data) {
        setHistory(histRes.value.data);
      }
      if (teamsRes.status === 'fulfilled' && teamsRes.value.data) {
        setSavedTeams(teamsRes.value.data);
      }
    } catch (e) {
      console.warn('Failed loading user data:', e);
    }
  };

  const handleGenerate = async (shouldScroll = true) => {
    setIsGenerating(true);
    try {
      const res = await apiService.generateActivities({
        ...generatorForm,
        exclude_titles: generatedActivities.map((a) => a.title)
      }, token);

      if (res.data && res.data.length > 0) {
        setGeneratedActivities(res.data);
        setGenerationSourceInfo(res.message || '');
        if (shouldScroll && generatorRef.current) {
          generatorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // Refresh history if logged in
        if (user && token) {
          apiService.getHistory(token).then((h) => {
            if (h.data) setHistory(h.data);
          });
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to generate activities. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateCard = async (oldActivity) => {
    try {
      const allTitles = generatedActivities.map((a) => a.title);
      const res = await apiService.regenerateActivity({
        ...generatorForm,
        exclude_titles: allTitles
      });

      if (res.data) {
        setGeneratedActivities((prev) =>
          prev.map((act) => (act.id === oldActivity.id ? res.data : act))
        );
        success(`Replaced "${oldActivity.title}" with "${res.data.title}"`);
      }
    } catch (err) {
      toastError('Failed to regenerate activity.');
    }
  };

  const handleToggleFavorite = async (activity) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }

    const isFav = favorites.some(
      (f) => f.id === activity.id || f.title === activity.title || f.activity_id === activity.id
    );

    try {
      if (isFav) {
        const favItem = favorites.find(
          (f) => f.id === activity.id || f.title === activity.title || f.activity_id === activity.id
        );
        const removeId = favItem?.favorite_id || favItem?.id || activity.id;
        await apiService.removeFavorite(removeId, token);
        setFavorites((prev) => prev.filter((f) => f.id !== activity.id && f.title !== activity.title));
        info(`Removed "${activity.title}" from favorites`);
      } else {
        const res = await apiService.addFavorite(activity, token);
        setFavorites((prev) => [res.data || activity, ...prev]);
        success(`Saved "${activity.title}" to favorites ❤️`);
      }
    } catch (err) {
      toastError(err.message || 'Error updating favorites');
    }
  };

  const isFavorited = (activityId) => {
    return favorites.some(
      (f) => f.id === activityId || f.activity_id === activityId || f.favorite_id === activityId
    );
  };

  const handleStartActivity = (activity) => {
    setActivePlayActivity(activity);
  };

  const handleShareActivity = (activity) => {
    setShareTargetActivity(activity);
  };

  const handlePrintActivity = (activity) => {
    window.print();
  };

  const handleApplyPreset = (presetData) => {
    setGeneratorForm((prev) => ({ ...prev, ...presetData }));
    setActiveTeamName('');
    setCurrentView('generator');
    setTimeout(() => {
      if (generatorRef.current) {
        generatorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      handleGenerate(true);
    }, 100);
  };

  const handleApplyTeamToGenerator = (team) => {
    setGeneratorForm((prev) => ({
      ...prev,
      team_size: team.team_size,
      setting: team.setting,
      vibe: team.vibe
    }));
    setActiveTeamName(team.team_name);
    setCurrentView('generator');
    setTimeout(() => {
      if (generatorRef.current) {
        generatorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      handleGenerate(true);
    }, 100);
    success(`Loaded "${team.team_name}" settings!`);
  };

  const handleCreateTeam = async (teamData) => {
    const res = await apiService.createTeam(teamData, token);
    if (res.data) setSavedTeams((prev) => [res.data, ...prev]);
  };

  const handleUpdateTeam = async (id, teamData) => {
    const res = await apiService.updateTeam(id, teamData, token);
    if (res.data) {
      setSavedTeams((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    }
  };

  const handleDeleteTeam = async (id) => {
    await apiService.deleteTeam(id, token);
    setSavedTeams((prev) => prev.filter((t) => t.id !== id));
    success('Team deleted');
  };

  const handleClearHistory = async () => {
    await apiService.clearHistory(token);
    setHistory([]);
  };

  const handleReopenGeneration = (activities, record) => {
    setGeneratedActivities(activities);
    if (record) {
      setGeneratorForm((prev) => ({
        ...prev,
        team_size: record.team_size,
        setting: record.setting,
        vibe: record.vibe,
        activity_type: record.activity_type
      }));
    }
    setCurrentView('generator');
    setTimeout(() => {
      if (generatorRef.current) {
        generatorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    success('Reopened generation batch!');
  };

  const scrollToGenerator = () => {
    setCurrentView('generator');
    if (generatorRef.current) {
      generatorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        favoritesCount={favorites.length}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        savedTeams={savedTeams}
        onSelectTeam={handleApplyTeamToGenerator}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'generator' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onScrollToGenerator={scrollToGenerator}
              onOpenSurprise={() => setIsSurpriseOpen(true)}
              onOpenQuiz={() => setCurrentView('quiz')}
              onApplyPreset={handleApplyPreset}
            />

            {/* Generator Workspace Section */}
            <section ref={generatorRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Activity Generator
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Dial in your team's situation and let AI craft tailored engagement activities.
                </p>
              </div>

              {/* Multi-Selector Form */}
              <div className="max-w-4xl mx-auto mb-12">
                <ActivityGenerator
                  formData={generatorForm}
                  setFormData={setGeneratorForm}
                  onGenerate={() => handleGenerate(true)}
                  isGenerating={isGenerating}
                  activeTeamName={activeTeamName}
                  onClearTeam={() => setActiveTeamName('')}
                />
              </div>

              {/* Source Mode Notification Banner */}
              {generationSourceInfo && (
                <div className="max-w-4xl mx-auto mb-6 px-4 py-2.5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-xs text-brand-900 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>{generationSourceInfo}</span>
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 bg-white px-2 py-0.5 rounded-full border border-brand-200">
                    {generatedActivities.length} Suggestions
                  </span>
                </div>
              )}

              {/* Generated Cards Grid */}
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-600" />
                    <span>Tailored Recommendations ({generatedActivities.length})</span>
                  </h3>
                  <button
                    onClick={() => handleGenerate(false)}
                    disabled={isGenerating}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1"
                  >
                    <span>Refresh all suggestions</span>
                  </button>
                </div>

                {isGenerating ? (
                  /* Loading Skeletons */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                        <div className="flex gap-2">
                          <div className="w-16 h-5 bg-slate-200 rounded-full" />
                          <div className="w-12 h-5 bg-slate-200 rounded-full" />
                        </div>
                        <div className="w-3/4 h-6 bg-slate-200 rounded-lg" />
                        <div className="space-y-2">
                          <div className="w-full h-3 bg-slate-100 rounded" />
                          <div className="w-5/6 h-3 bg-slate-100 rounded" />
                        </div>
                        <div className="w-full h-14 bg-slate-50 rounded-2xl" />
                        <div className="w-full h-10 bg-slate-200 rounded-xl mt-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {generatedActivities.map((act) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        isFavorite={isFavorited(act.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onStart={handleStartActivity}
                        onRegenerate={handleRegenerateCard}
                        onShare={handleShareActivity}
                        onPrint={handlePrintActivity}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {currentView === 'explore' && (
          <ExplorePage
            onStartActivity={handleStartActivity}
            onToggleFavorite={handleToggleFavorite}
            isFavorited={isFavorited}
            onShareActivity={handleShareActivity}
            onPrintActivity={handlePrintActivity}
          />
        )}

        {currentView === 'quiz' && (
          <TeamVibeQuiz
            onStartActivity={handleStartActivity}
            onToggleFavorite={handleToggleFavorite}
            isFavorited={isFavorited}
          />
        )}

        {currentView === 'trivia' && <TriviaGame />}

        {currentView === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onRemoveFavorite={(id) => handleToggleFavorite({ id })}
            onStartActivity={handleStartActivity}
            onShareActivity={handleShareActivity}
            onOpenGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onReopenGeneration={handleReopenGeneration}
            onOpenGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'teams' && (
          <TeamsManager
            teams={savedTeams}
            onCreateTeam={handleCreateTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
            onApplyTeamToGenerator={handleApplyTeamToGenerator}
          />
        )}
      </main>

      {/* Footer & Live Diagnostic Status */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-[10px]">
              V
            </div>
            <span className="font-extrabold text-slate-900">VIBECRAFT AI</span>
            <span>—</span>
            <span>Turn awkward silence into meaningful connection.</span>
          </div>

          {/* System Diagnostic Status Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend: <strong>Online</strong></span>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium">
              <span>AI Engine: </span>
              <strong className={systemHealth?.config?.ai?.liveApiKeyConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                {systemHealth?.config?.ai?.liveApiKeyConfigured ? 'Gemini 2.5 Flash' : 'Curated Fallback Engine (40 Activities)'}
              </strong>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium">
              <span>Database: </span>
              <strong className={systemHealth?.config?.database?.connected ? 'text-emerald-700' : 'text-slate-700'}>
                {systemHealth?.config?.database?.connected ? 'Supabase PostgreSQL' : 'Local Dev Store'}
              </strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AuthModal />

      <PlayModeModal
        activity={activePlayActivity}
        isOpen={Boolean(activePlayActivity)}
        onClose={() => setActivePlayActivity(null)}
      />

      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        onStartActivity={handleStartActivity}
        onToggleFavorite={handleToggleFavorite}
        isFavorited={isFavorited}
      />

      <ShareModal
        activity={shareTargetActivity}
        isOpen={Boolean(shareTargetActivity)}
        onClose={() => setShareTargetActivity(null)}
      />
    </div>
  );
}
