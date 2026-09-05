import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import activityRoutes from './routes/activityRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import teamsRoutes from './routes/teamsRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import triviaRoutes from './routes/triviaRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { aiService } from './services/aiService.js';
import { supabaseService } from './services/supabaseService.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for preview/sandbox environments
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// System Diagnostic & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    product: 'VibeCraft AI API',
    tagline: 'Turn awkward silence into meaningful connection',
    timestamp: new Date().toISOString(),
    config: {
      ai: {
        provider: 'Google Gemini',
        model: aiService.modelName,
        liveApiKeyConfigured: aiService.isAvailable(),
        mode: aiService.isAvailable() ? 'live_generative' : 'curated_fallback_ready'
      },
      database: {
        provider: 'Supabase PostgreSQL',
        connected: supabaseService.isConfigured,
        mode: supabaseService.isConfigured ? 'supabase_cloud' : 'local_dev_store'
      }
    }
  });
});

// Mount Routes
app.use('/api/activities', activityRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/trivia', triviaRoutes);

// Global Error Handler
app.use(errorHandler);

// Startup & Configuration Summary
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 VIBECRAFT AI Backend running on http://localhost:${PORT}`);
  console.log('====================================================');

  if (aiService.isAvailable()) {
    console.log('✨ [AI] Gemini API Key detected. Live Generative AI is ACTIVE.');
  } else {
    console.log('💡 [AI] Running with 40-item Curated Fallback Dataset.');
    console.log('   To activate live Gemini AI, add GEMINI_API_KEY in backend/.env');
  }

  if (supabaseService.isConfigured) {
    console.log('🗄️  [Database] Supabase PostgreSQL connection is ACTIVE.');
  } else {
    console.log('💾 [Database] Using in-memory store for development/demo.');
    console.log('   To connect real Supabase, add SUPABASE_URL & ANON_KEY in backend/.env');
  }
  console.log('====================================================');
});
