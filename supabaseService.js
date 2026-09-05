import { createClient } from '@supabase/supabase-js';
import { CURATED_ACTIVITIES } from '../data/curatedActivities.js';

class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.client = null;
    this.adminClient = null;
    this.isConfigured = false;

    // In-memory mock store for demo/development when Supabase credentials are not yet added
    this.mockStore = {
      favorites: new Map(), // userId -> Set of activityIds or activity objects
      history: new Map(),   // userId -> Array of history entries
      teams: new Map(),     // userId -> Array of team objects
      quizResults: new Map(),// userId -> Array of quiz results
      activities: [...CURATED_ACTIVITIES]
    };

    this.init();
  }

  init() {
    const isUrlValid = this.supabaseUrl && !this.supabaseUrl.includes('YOUR_') && this.supabaseUrl.startsWith('http');
    const isKeyValid = this.supabaseAnonKey && !this.supabaseAnonKey.includes('YOUR_');

    if (isUrlValid && isKeyValid) {
      try {
        this.client = createClient(this.supabaseUrl, this.supabaseAnonKey);
        if (this.supabaseServiceKey && !this.supabaseServiceKey.includes('YOUR_')) {
          this.adminClient = createClient(this.supabaseUrl, this.supabaseServiceKey);
        }
        this.isConfigured = true;
        console.log('[SupabaseService] Connected to Supabase PostgreSQL at:', this.supabaseUrl);
      } catch (err) {
        console.warn('[SupabaseService] Failed to initialize Supabase client:', err.message);
        this.isConfigured = false;
      }
    } else {
      console.log('[SupabaseService] No active SUPABASE_URL / ANON_KEY in backend/.env. Using development in-memory store.');
      this.isConfigured = false;
    }
  }

  /**
   * Helper to get appropriate client (authenticated user client if token provided)
   */
  getUserClient(token) {
    if (!this.isConfigured || !token) return this.client;
    return createClient(this.supabaseUrl, this.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
  }

  // ==========================================
  // ACTIVITIES
  // ==========================================
  async getActivities({ query, type, vibe, setting, limit = 50 }) {
    if (!this.isConfigured) {
      let list = this.mockStore.activities;
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      }
      if (type && type !== 'All') list = list.filter(a => a.activity_type.toLowerCase() === type.toLowerCase());
      if (vibe && vibe !== 'All') list = list.filter(a => a.vibe.toLowerCase() === vibe.toLowerCase());
      if (setting && setting !== 'All') list = list.filter(a => a.setting === 'All' || a.setting.toLowerCase() === setting.toLowerCase());
      return list.slice(0, limit);
    }

    try {
      let req = this.client.from('activities').select('*');
      if (query) req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      if (type && type !== 'All') req = req.eq('activity_type', type);
      if (vibe && vibe !== 'All') req = req.eq('vibe', vibe);
      if (setting && setting !== 'All') req = req.or(`setting.eq.${setting},setting.eq.All`);
      req = req.limit(limit);

      const { data, error } = await req;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[SupabaseService] getActivities error, falling back to mock:', err.message);
      return this.mockStore.activities.slice(0, limit);
    }
  }

  // ==========================================
  // FAVORITES
  // ==========================================
  async getFavorites(userId, token) {
    if (!this.isConfigured) {
      const userFavs = this.mockStore.favorites.get(userId) || [];
      return Array.from(userFavs);
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('favorites')
      .select('id, created_at, activity_id, activities (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(f => ({
      favorite_id: f.id,
      created_at: f.created_at,
      ...f.activities
    }));
  }

  async addFavorite(userId, activity, token) {
    if (!this.isConfigured) {
      if (!this.mockStore.favorites.has(userId)) {
        this.mockStore.favorites.set(userId, []);
      }
      const favs = this.mockStore.favorites.get(userId);
      // Avoid duplicate
      const exists = favs.some(item => item.id === activity.id || item.title === activity.title);
      if (!exists) {
        const entry = {
          favorite_id: `mock-fav-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...activity
        };
        favs.push(entry);
        return entry;
      }
      return favs.find(item => item.id === activity.id || item.title === activity.title);
    }

    const client = this.getUserClient(token);

    // If activity does not exist in DB activities table yet, insert it first
    let activityId = activity.id;
    const { data: existingAct } = await this.client
      .from('activities')
      .select('id')
      .eq('id', activityId)
      .maybeSingle();

    if (!existingAct) {
      const { data: newAct, error: actErr } = await (this.adminClient || client)
        .from('activities')
        .insert({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          activity_type: activity.activity_type || activity.type || 'Icebreaker',
          duration_minutes: activity.duration_minutes || 10,
          team_size_min: activity.team_size_min || 2,
          team_size_max: activity.team_size_max || 50,
          setting: activity.setting || 'All',
          vibe: activity.vibe || 'Casual',
          difficulty: activity.difficulty || 'Easy',
          instructions: activity.instructions || [],
          materials: activity.materials || [],
          why_it_works: activity.why_it_works || '',
          ai_generated: !!activity.ai_generated
        })
        .select()
        .single();

      if (newAct) activityId = newAct.id;
    }

    const { data, error } = await client
      .from('favorites')
      .insert({ user_id: userId, activity_id: activityId })
      .select('id, created_at, activity_id, activities (*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation (already favorited)
        return { message: 'Already in favorites', activity_id: activityId };
      }
      throw error;
    }

    return {
      favorite_id: data.id,
      created_at: data.created_at,
      ...data.activities
    };
  }

  async removeFavorite(userId, activityId, token) {
    if (!this.isConfigured) {
      const favs = this.mockStore.favorites.get(userId) || [];
      const updated = favs.filter(f => f.id !== activityId && f.favorite_id !== activityId && f.activity_id !== activityId);
      this.mockStore.favorites.set(userId, updated);
      return { success: true };
    }

    const client = this.getUserClient(token);
    const { error } = await client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .or(`activity_id.eq.${activityId},id.eq.${activityId}`);

    if (error) throw error;
    return { success: true };
  }

  // ==========================================
  // GENERATION HISTORY
  // ==========================================
  async getHistory(userId, token) {
    if (!this.isConfigured) {
      return this.mockStore.history.get(userId) || [];
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('generation_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async saveHistory(userId, record, token) {
    if (!this.isConfigured) {
      if (!this.mockStore.history.has(userId)) {
        this.mockStore.history.set(userId, []);
      }
      const entry = {
        id: `mock-hist-${Date.now()}`,
        user_id: userId,
        ...record,
        created_at: new Date().toISOString()
      };
      this.mockStore.history.get(userId).unshift(entry);
      return entry;
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('generation_history')
      .insert({
        user_id: userId,
        team_size: record.team_size,
        setting: record.setting,
        vibe: record.vibe,
        activity_type: record.activity_type,
        generated_activities: record.generated_activities
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async clearHistory(userId, token) {
    if (!this.isConfigured) {
      this.mockStore.history.set(userId, []);
      return { success: true };
    }

    const client = this.getUserClient(token);
    const { error } = await client
      .from('generation_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }

  // ==========================================
  // TEAMS
  // ==========================================
  async getTeams(userId, token) {
    if (!this.isConfigured) {
      return this.mockStore.teams.get(userId) || [];
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('teams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTeam(userId, teamData, token) {
    if (!this.isConfigured) {
      if (!this.mockStore.teams.has(userId)) {
        this.mockStore.teams.set(userId, []);
      }
      const entry = {
        id: `mock-team-${Date.now()}`,
        user_id: userId,
        team_name: teamData.team_name,
        team_size: teamData.team_size,
        setting: teamData.setting,
        vibe: teamData.vibe,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.mockStore.teams.get(userId).unshift(entry);
      return entry;
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('teams')
      .insert({
        user_id: userId,
        team_name: teamData.team_name,
        team_size: teamData.team_size,
        setting: teamData.setting,
        vibe: teamData.vibe
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTeam(userId, teamId, updates, token) {
    if (!this.isConfigured) {
      const teams = this.mockStore.teams.get(userId) || [];
      const index = teams.findIndex(t => t.id === teamId);
      if (index !== -1) {
        teams[index] = { ...teams[index], ...updates, updated_at: new Date().toISOString() };
        return teams[index];
      }
      throw new Error('Team not found');
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('teams')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', teamId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTeam(userId, teamId, token) {
    if (!this.isConfigured) {
      const teams = this.mockStore.teams.get(userId) || [];
      this.mockStore.teams.set(userId, teams.filter(t => t.id !== teamId));
      return { success: true };
    }

    const client = this.getUserClient(token);
    const { error } = await client
      .from('teams')
      .delete()
      .eq('id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }

  // ==========================================
  // QUIZ RESULTS
  // ==========================================
  async saveQuizResult(userId, resultData, token) {
    if (!this.isConfigured) {
      if (!this.mockStore.quizResults.has(userId)) {
        this.mockStore.quizResults.set(userId, []);
      }
      const entry = {
        id: `mock-quiz-${Date.now()}`,
        user_id: userId,
        score: resultData.score || 0,
        answers: resultData.answers || {},
        vibe_result: resultData.vibe_result,
        created_at: new Date().toISOString()
      };
      this.mockStore.quizResults.get(userId).unshift(entry);
      return entry;
    }

    const client = this.getUserClient(token);
    const { data, error } = await client
      .from('quiz_results')
      .insert({
        user_id: userId,
        score: resultData.score || 0,
        answers: resultData.answers || {},
        vibe_result: resultData.vibe_result
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const supabaseService = new SupabaseService();
