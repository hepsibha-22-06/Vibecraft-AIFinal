export const ALLOWED_SETTINGS = ['Remote', 'In-person', 'Hybrid', 'All'];
export const ALLOWED_VIBES = ['Casual', 'Professional', 'Energetic', 'Creative', 'Relaxed', 'All'];
export const ALLOWED_TYPES = ['Icebreaker', 'Team Building', 'Trivia', 'Quick Game', 'Conversation Starter', 'All'];
export const ALLOWED_SIZES = ['2-5', '6-10', '11-20', '21-50', '50+'];

export function sanitizeString(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export function validateGeneratePayload(body) {
  const errors = [];
  const team_size = body.team_size || '6-10';
  const setting = body.setting || 'Hybrid';
  const vibe = body.vibe || 'Casual';
  const activity_type = body.activity_type || 'Icebreaker';
  const duration_minutes = Number(body.duration_minutes) || 15;
  const topic = sanitizeString(body.topic || '', 150);
  const difficulty = body.difficulty || 'Easy';
  const exclude_titles = Array.isArray(body.exclude_titles) ? body.exclude_titles.map(t => sanitizeString(t, 100)) : [];

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      team_size,
      setting,
      vibe,
      activity_type,
      duration_minutes,
      topic,
      difficulty,
      exclude_titles
    }
  };
}
