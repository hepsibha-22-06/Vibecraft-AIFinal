const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithAuth(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Network request failed');
  }
  return data;
}

export const apiService = {
  // Health & diagnostics
  async getHealth() {
    return fetchWithAuth('/health');
  },

  // Activities
  async generateActivities(payload, token = null) {
    return fetchWithAuth('/activities/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
  },

  async surpriseMe(params = {}) {
    return fetchWithAuth('/activities/surprise', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async regenerateActivity(payload) {
    return fetchWithAuth('/activities/regenerate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getActivities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/activities?${query}`);
  },

  async getActivityById(id) {
    return fetchWithAuth(`/activities/${id}`);
  },

  // Favorites
  async getFavorites(token) {
    return fetchWithAuth('/favorites', { method: 'GET' }, token);
  },

  async addFavorite(activity, token) {
    return fetchWithAuth('/favorites', {
      method: 'POST',
      body: JSON.stringify(activity)
    }, token);
  },

  async removeFavorite(activityId, token) {
    return fetchWithAuth(`/favorites/${activityId}`, {
      method: 'DELETE'
    }, token);
  },

  // Generation History
  async getHistory(token) {
    return fetchWithAuth('/history', { method: 'GET' }, token);
  },

  async clearHistory(token) {
    return fetchWithAuth('/history', { method: 'DELETE' }, token);
  },

  // Teams
  async getTeams(token) {
    return fetchWithAuth('/teams', { method: 'GET' }, token);
  },

  async createTeam(teamData, token) {
    return fetchWithAuth('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData)
    }, token);
  },

  async updateTeam(id, teamData, token) {
    return fetchWithAuth(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData)
    }, token);
  },

  async deleteTeam(id, token) {
    return fetchWithAuth(`/teams/${id}`, {
      method: 'DELETE'
    }, token);
  },

  // Team Vibe Quiz
  async analyzeQuiz(answers, token = null) {
    return fetchWithAuth('/quiz/analyze', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }, token);
  },

  // Trivia
  async getTrivia(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/trivia?${query}`);
  }
};
