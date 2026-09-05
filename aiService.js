import { GoogleGenAI } from '@google/genai';
import { fallbackService } from './fallbackService.js';
import crypto from 'crypto';

class AIService {
  constructor() {
    this.client = null;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.initClient();
  }

  initClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_')) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        console.log(`[AIService] Google GenAI initialized successfully with model: ${this.modelName}`);
      } catch (err) {
        console.warn('[AIService] Failed to initialize Google GenAI:', err.message);
        this.client = null;
      }
    } else {
      console.log('[AIService] No valid GEMINI_API_KEY configured. Running in Fallback/Curated Mode.');
      this.client = null;
    }
  }

  isAvailable() {
    const apiKey = process.env.GEMINI_API_KEY;
    return !!(apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_'));
  }

  /**
   * Generates 3-5 activities matching criteria
   */
  async generateActivities({
    team_size = '6-10',
    setting = 'Hybrid',
    vibe = 'Casual',
    activity_type = 'Icebreaker',
    duration_minutes = 15,
    topic = '',
    difficulty = 'Easy',
    exclude_titles = []
  }) {
    if (!this.isAvailable()) {
      console.log('[AIService] Generating via curated fallback engine...');
      const fallbackList = fallbackService.getActivities({
        team_size,
        setting,
        vibe,
        activity_type,
        max_duration: duration_minutes,
        limit: 4,
        exclude_titles
      });
      return {
        activities: fallbackList.map(a => ({ ...a, ai_generated: false })),
        source: 'curated_fallback',
        message: 'Loaded from curated activity catalog (Add GEMINI_API_KEY in backend/.env for generative AI).'
      };
    }

    try {
      if (!this.client) this.initClient();

      const prompt = `You are VibeCraft AI, an expert organizational psychologist and world-class team-building facilitator.
Generate 4 distinct, engaging, creative, and realistic activities for a team with these exact specifications:
- Team Size: ${team_size}
- Work Setting: ${setting} (Remote, In-person, or Hybrid)
- Desired Vibe: ${vibe}
- Activity Type: ${activity_type}
- Target Duration: ~${duration_minutes} minutes
- Difficulty: ${difficulty}
${topic ? `- Theme / Focus: ${topic}` : ''}
${exclude_titles.length > 0 ? `- EXCLUDE these activities that were already presented: ${exclude_titles.join(', ')}` : ''}

CRITICAL RULES:
1. Every activity must be practical, safe, highly engaging, and non-cringe.
2. Return ONLY valid JSON matching this exact structure:
{
  "activities": [
    {
      "title": "Clear creative title",
      "description": "Engaging 1-2 sentence overview",
      "activity_type": "${activity_type}",
      "duration_minutes": 15,
      "team_size": "${team_size}",
      "setting": "${setting}",
      "vibe": "${vibe}",
      "difficulty": "${difficulty}",
      "instructions": [
        "Step 1: Specific action",
        "Step 2: Specific action",
        "Step 3: Specific action"
      ],
      "materials": ["Item 1", "Item 2"],
      "why_it_works": "1-2 sentences on group psychology and why this breaks tension or builds trust."
    }
  ]
}`;

      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const responseText = response.text || '';
      const parsedData = this.safeParseJSON(responseText);

      if (parsedData && Array.isArray(parsedData.activities) && parsedData.activities.length > 0) {
        const enriched = parsedData.activities.map(act => ({
          id: crypto.randomUUID(),
          title: act.title || 'Interactive Team Activity',
          description: act.description || '',
          activity_type: act.activity_type || act.type || activity_type,
          duration_minutes: Number(act.duration_minutes) || duration_minutes || 10,
          team_size_min: 2,
          team_size_max: 50,
          setting: act.setting || setting,
          vibe: act.vibe || vibe,
          difficulty: act.difficulty || difficulty,
          instructions: Array.isArray(act.instructions) ? act.instructions : [act.instructions || 'Follow facilitator guidelines.'],
          materials: Array.isArray(act.materials) ? act.materials : [act.materials || 'None'],
          why_it_works: act.why_it_works || 'Fosters collaboration and open team dialogue.',
          ai_generated: true,
          created_at: new Date().toISOString()
        }));

        return {
          activities: enriched,
          source: 'gemini_ai',
          message: 'Freshly synthesized by VibeCraft Gemini AI.'
        };
      } else {
        throw new Error('Malformed JSON structure returned from AI model');
      }
    } catch (error) {
      console.warn('[AIService] AI Generation failed or timed out:', error.message);
      console.log('[AIService] Seamlessly switching to curated fallback...');
      const fallbackList = fallbackService.getActivities({
        team_size,
        setting,
        vibe,
        activity_type,
        max_duration: duration_minutes,
        limit: 4,
        exclude_titles
      });
      return {
        activities: fallbackList.map(a => ({ ...a, ai_generated: false })),
        source: 'curated_fallback',
        message: 'AI is taking a quick break — here are some great activities from our curated collection.'
      };
    }
  }

  /**
   * Generates a single Surprise Me activity
   */
  async surpriseMe({ setting = 'All', vibe = 'All', exclude_titles = [] } = {}) {
    if (!this.isAvailable()) {
      const surprise = fallbackService.getSurpriseActivity({ setting, vibe, exclude_titles });
      return {
        activity: { ...surprise, ai_generated: false },
        source: 'curated_fallback'
      };
    }

    try {
      if (!this.client) this.initClient();
      const prompt = `Generate 1 wildly creative, surprising, high-energy, memorable icebreaker or team activity for a ${setting === 'All' ? 'modern' : setting} team.
${vibe !== 'All' ? `Target vibe: ${vibe}.` : 'Choose an unexpected fun vibe.'}
${exclude_titles.length > 0 ? `Do NOT repeat: ${exclude_titles.join(', ')}` : ''}

Return ONLY valid JSON matching this schema:
{
  "activity": {
    "title": "Punchy surprising title",
    "description": "Vivid 1-2 sentence premise",
    "activity_type": "Icebreaker",
    "duration_minutes": 10,
    "team_size": "4-20",
    "setting": "Hybrid",
    "vibe": "Energetic",
    "difficulty": "Easy",
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "materials": ["Item 1"],
    "why_it_works": "Why this creates instant laughter or breakthrough connection."
  }
}`;

      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.85
        }
      });

      const parsed = this.safeParseJSON(response.text || '');
      if (parsed && parsed.activity && parsed.activity.title) {
        return {
          activity: {
            id: crypto.randomUUID(),
            ...parsed.activity,
            ai_generated: true,
            created_at: new Date().toISOString()
          },
          source: 'gemini_ai'
        };
      }
      throw new Error('Surprise response invalid');
    } catch (err) {
      console.warn('[AIService] Surprise failed, using curated surprise:', err.message);
      const surprise = fallbackService.getSurpriseActivity({ setting, vibe, exclude_titles });
      return {
        activity: { ...surprise, ai_generated: false },
        source: 'curated_fallback'
      };
    }
  }

  /**
   * Safely parses JSON with regex recovery if wrapped in markdown
   */
  safeParseJSON(text) {
    if (!text || typeof text !== 'string') return null;
    try {
      return JSON.parse(text);
    } catch (e1) {
      try {
        // Strip markdown code block wrappers if any: ```json ... ```
        const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (match) {
          return JSON.parse(match[0]);
        }
      } catch (e2) {
        console.error('[AIService] Failed regex JSON recovery:', e2.message);
      }
    }
    return null;
  }
}

export const aiService = new AIService();
