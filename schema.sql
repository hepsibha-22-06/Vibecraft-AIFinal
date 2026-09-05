-- ==========================================================
-- VIBECRAFT AI - SUPABASE POSTGRESQL SCHEMA WITH RLS
-- Generative AI Icebreaker & Team-Building Activity Generator
-- ==========================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with profile information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. ACTIVITIES TABLE
-- Stores curated and user/AI-generated activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    activity_type TEXT NOT NULL, -- 'Icebreaker', 'Team Building', 'Trivia', 'Quick Game', 'Conversation Starter'
    duration_minutes INTEGER NOT NULL DEFAULT 10,
    team_size_min INTEGER NOT NULL DEFAULT 2,
    team_size_max INTEGER NOT NULL DEFAULT 50,
    setting TEXT NOT NULL, -- 'Remote', 'In-person', 'Hybrid', 'All'
    vibe TEXT NOT NULL, -- 'Casual', 'Professional', 'Energetic', 'Creative', 'Relaxed'
    difficulty TEXT NOT NULL DEFAULT 'Easy', -- 'Easy', 'Medium', 'Hard'
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    materials JSONB NOT NULL DEFAULT '[]'::jsonb,
    why_it_works TEXT,
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. FAVORITES TABLE
-- Tracks saved activities per authenticated user
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_activity_favorite UNIQUE(user_id, activity_id)
);

-- 4. GENERATION HISTORY TABLE
-- Logs AI activity generations per user
CREATE TABLE IF NOT EXISTS public.generation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_size TEXT NOT NULL,
    setting TEXT NOT NULL,
    vibe TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    generated_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TEAMS TABLE
-- Saved team configurations for 1-click generator auto-fill
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    team_size TEXT NOT NULL,
    setting TEXT NOT NULL,
    vibe TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. QUIZ RESULTS TABLE
-- Stores results of the Team Vibe Quiz
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    vibe_result TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_vibe ON public.activities(vibe);
CREATE INDEX IF NOT EXISTS idx_activities_setting ON public.activities(setting);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_activity ON public.favorites(activity_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON public.generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_user ON public.teams(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON public.quiz_results(user_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Activities Policies
-- Curated activities and public activities can be viewed by anyone (including anonymous visitors)
CREATE POLICY "Anyone can view public and curated activities"
    ON public.activities FOR SELECT
    USING (true);

-- Authenticated users can insert their own generated or custom activities
CREATE POLICY "Authenticated users can create activities"
    ON public.activities FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Favorites Policies
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Generation History Policies
CREATE POLICY "Users can view their own history"
    ON public.generation_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save history"
    ON public.generation_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
    ON public.generation_history FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Teams Policies
CREATE POLICY "Users can view their own teams"
    ON public.teams FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teams"
    ON public.teams FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
    ON public.teams FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
    ON public.teams FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Quiz Results Policies
CREATE POLICY "Users can view their own quiz results"
    ON public.quiz_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
    ON public.quiz_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
