import { CURATED_ACTIVITIES } from '../data/curatedActivities.js';

// Pre-curated high quality trivia questions for offline/fallback mode
export const CURATED_TRIVIA_QUESTIONS = [
  {
    id: "trivia-1",
    category: "Tech & Innovation",
    question: "What was the very first computer mouse made out of?",
    options: ["Plastic", "Wood", "Aluminum", "Glass"],
    correct_index: 1,
    explanation: "Invented by Douglas Engelbart in 1964 at Stanford Research Institute, the original mouse was carved from a block of wood with two metal wheels."
  },
  {
    id: "trivia-2",
    category: "Pop Culture & Cinema",
    question: "Which movie was the first feature-length animated film completely rendered in computer graphics (CGI)?",
    options: ["Toy Story", "Shrek", "A Bug's Life", "Monsters, Inc."],
    correct_index: 0,
    explanation: "Pixar's 'Toy Story' debuted in November 1995 as the first entirely computer-animated feature film in cinematic history."
  },
  {
    id: "trivia-3",
    category: "World Wonders & Nature",
    question: "Which country has the most natural lakes in the world, containing over 60% of all lakes on Earth?",
    options: ["Russia", "United States", "Canada", "Finland"],
    correct_index: 2,
    explanation: "Canada boasts an estimated 2 million lakes, covering roughly 9% of its total surface area."
  },
  {
    id: "trivia-4",
    category: "Science & Space",
    question: "Roughly how long does it take for sunlight to travel from the surface of the Sun to Earth?",
    options: ["8 minutes and 20 seconds", "1 hour and 12 minutes", "30 seconds", "4 minutes and 10 seconds"],
    correct_index: 0,
    explanation: "Light travelling at ~300,000 km/s crosses the roughly 150 million km distance between Sun and Earth in approximately 499 seconds (8 mins 20 secs)."
  },
  {
    id: "trivia-5",
    category: "Workplace & Culture",
    question: "The term 'bug' in computer science was famously popularized in 1947 after an actual moth was discovered trapped in which system?",
    options: ["ENIAC", "Harvard Mark II", "IBM 701", "Colossus"],
    correct_index: 1,
    explanation: "Grace Hopper and her team taped a live moth removed from Relay #70 of the Harvard Mark II computer into their logbook with the caption: 'First actual case of bug being found.'"
  },
  {
    id: "trivia-6",
    category: "Language & Etymology",
    question: "Where did the phrase 'bite the bullet' (meaning to endure a painful situation with courage) originate?",
    options: ["Old West gunfights", "Battlefield battlefield surgeries without anesthesia", "Duel negotiations", "Ammunition testing"],
    correct_index: 1,
    explanation: "Before modern military anesthetics existed, wounded soldiers were given a lead bullet to bite down on to cope with severe surgical pain."
  },
  {
    id: "trivia-7",
    category: "Food & Geography",
    question: "Which country is the birthplace of the Croissant?",
    options: ["France", "Austria", "Switzerland", "Belgium"],
    correct_index: 1,
    explanation: "The croissant originated in Austria as the 'Kipferl' celebrating the end of the 1683 Ottoman siege of Vienna, before migrating to Paris."
  },
  {
    id: "trivia-8",
    category: "Brain Teaser",
    question: "What English word has 3 consecutive double letters?",
    options: ["Bookkeeper", "Mississippi", "Subcommittee", "Footloose"],
    correct_index: 0,
    explanation: "Bookkeeper (and bookkeeping) features oo, kk, and ee back-to-back!"
  }
];

class FallbackService {
  /**
   * Filters curated activities by team parameters
   */
  getActivities({ team_size, setting, vibe, activity_type, max_duration, limit = 4, exclude_titles = [] }) {
    let filtered = CURATED_ACTIVITIES.filter(act => {
      // Exclude titles already shown
      if (exclude_titles && exclude_titles.length > 0) {
        const isExcluded = exclude_titles.some(title => 
          title.toLowerCase().trim() === act.title.toLowerCase().trim()
        );
        if (isExcluded) return false;
      }

      // Filter by activity type if provided
      if (activity_type && activity_type !== 'All') {
        if (act.activity_type.toLowerCase() !== activity_type.toLowerCase()) {
          return false;
        }
      }

      // Filter by setting if provided
      if (setting && setting !== 'All' && act.setting !== 'All') {
        if (act.setting.toLowerCase() !== setting.toLowerCase()) {
          return false;
        }
      }

      // Filter by vibe if provided
      if (vibe && vibe !== 'All') {
        if (act.vibe.toLowerCase() !== vibe.toLowerCase()) {
          return false;
        }
      }

      // Filter by max duration if provided
      if (max_duration && act.duration_minutes > Number(max_duration)) {
        return false;
      }

      return true;
    });

    // If filter is too restrictive and yields fewer than requested, widen to match vibe or setting
    if (filtered.length < limit) {
      const remaining = CURATED_ACTIVITIES.filter(act => {
        const notIncluded = !filtered.some(f => f.id === act.id);
        const notExcluded = !exclude_titles.some(t => t.toLowerCase() === act.title.toLowerCase());
        return notIncluded && notExcluded;
      });
      // Shuffle remaining and append
      filtered = [...filtered, ...this.shuffle(remaining)];
    }

    // Shuffle and slice to limit
    return this.shuffle(filtered).slice(0, limit);
  }

  /**
   * Pick a single surprise activity with optional vibe or setting bias
   */
  getSurpriseActivity({ setting, vibe, exclude_titles = [] } = {}) {
    let candidates = CURATED_ACTIVITIES.filter(act => {
      if (exclude_titles.includes(act.title)) return false;
      if (setting && setting !== 'All' && act.setting !== 'All') {
        if (act.setting.toLowerCase() !== setting.toLowerCase()) return false;
      }
      if (vibe && vibe !== 'All') {
        if (act.vibe.toLowerCase() !== vibe.toLowerCase()) return false;
      }
      return true;
    });

    if (candidates.length === 0) {
      candidates = CURATED_ACTIVITIES.filter(act => !exclude_titles.includes(act.title));
    }
    if (candidates.length === 0) {
      candidates = CURATED_ACTIVITIES;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  /**
   * Regenerates one specific activity replacement
   */
  regenerateActivity({ team_size, setting, vibe, activity_type, exclude_titles = [] }) {
    const fresh = this.getActivities({
      team_size,
      setting,
      vibe,
      activity_type,
      limit: 1,
      exclude_titles
    });

    return fresh[0] || this.getSurpriseActivity({ setting, vibe, exclude_titles });
  }

  /**
   * Returns curated trivia questions
   */
  getTriviaQuestions({ count = 5, category = null } = {}) {
    let list = [...CURATED_TRIVIA_QUESTIONS];
    if (category) {
      const byCat = list.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
      if (byCat.length >= count) list = byCat;
    }
    return this.shuffle(list).slice(0, count);
  }

  /**
   * Fisher-Yates shuffle
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

export const fallbackService = new FallbackService();
