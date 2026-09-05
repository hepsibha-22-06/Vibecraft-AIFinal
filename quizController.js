import { fallbackService } from '../services/fallbackService.js';
import { supabaseService } from '../services/supabaseService.js';

export async function analyzeQuiz(req, res, next) {
  try {
    const { answers } = req.body;
    // answers is expected to be an array or dictionary of selections:
    // e.g., { q1: "creative", q2: "chill", q3: "energetic", q4: "collaborative", q5: "competitive" }

    const vibeCounts = {
      Creative: 0,
      Energetic: 0,
      Relaxed: 0, // 'Chill' maps to Relaxed/Chill
      Professional: 0, // 'Collaborative/Structured'
      Casual: 0
    };

    if (answers && typeof answers === 'object') {
      Object.values(answers).forEach(val => {
        if (!val) return;
        const normalized = String(val).toLowerCase();
        if (normalized.includes('creat') || normalized.includes('innovat')) vibeCounts.Creative += 2;
        else if (normalized.includes('energ') || normalized.includes('hype') || normalized.includes('fast')) vibeCounts.Energetic += 2;
        else if (normalized.includes('chill') || normalized.includes('relax') || normalized.includes('quiet')) vibeCounts.Relaxed += 2;
        else if (normalized.includes('compet') || normalized.includes('win') || normalized.includes('trivia')) vibeCounts.Energetic += 1;
        else if (normalized.includes('collab') || normalized.includes('prof') || normalized.includes('focus')) vibeCounts.Professional += 2;
        else vibeCounts.Casual += 2;
      });
    }

    // Determine top vibe
    let topVibe = 'Casual';
    let maxCount = -1;
    for (const [vibe, count] of Object.entries(vibeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topVibe = vibe;
      }
    }

    // Curated persona titles and descriptions
    const personaMap = {
      Creative: {
        vibe_title: 'The Out-of-the-Box Innovators 🎨',
        vibe_tag: 'Creative',
        summary: 'Your team thrives on brainstorming, lateral thinking, playful metaphors, and original ideas. Routine bores you; novelty charges your batteries!'
      },
      Energetic: {
        vibe_title: 'The High-Octane Catalysts ⚡',
        vibe_tag: 'Energetic',
        summary: 'Your team brings momentum, rapid banter, spirited competition, and lightning engagement. You love speed and celebrations!'
      },
      Relaxed: {
        vibe_title: 'The Mindful Zen Collective 🌿',
        vibe_tag: 'Relaxed',
        summary: 'Your team values genuine emotional safety, reflective discussions, authentic vulnerability, and calm, low-pressure connection.'
      },
      Professional: {
        vibe_title: 'The Purpose-Driven Strategists 🎯',
        vibe_tag: 'Professional',
        summary: 'Your team appreciates clear outcomes, structured alignment, mutual mentorship, and deep intellectual respect.'
      },
      Casual: {
        vibe_title: 'The Good-Vibes Crew ☕',
        vibe_tag: 'Casual',
        summary: 'Easy-going, witty, and grounded. Your team connects best through shared laughter, stories, and comfortable camaraderie.'
      }
    };

    const persona = personaMap[topVibe] || personaMap.Casual;

    // Fetch 3 recommended activities matching this vibe
    const recommended = fallbackService.getActivities({
      vibe: topVibe,
      limit: 3
    });

    // Save to Supabase if authenticated
    let savedRecord = null;
    if (req.user) {
      try {
        savedRecord = await supabaseService.saveQuizResult(req.user.id, {
          score: maxCount,
          answers,
          vibe_result: persona.vibe_title
        }, req.token);
      } catch (err) {
        console.warn('[QuizController] Failed to save quiz result:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        persona,
        recommended_activities: recommended,
        saved: !!savedRecord
      }
    });
  } catch (error) {
    next(error);
  }
}
