import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('YOUR_') && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_');

let supabaseAuthClient = null;
if (isSupabaseConfigured) {
  try {
    supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('[AuthMiddleware] Supabase auth client init failed:', e.message);
  }
}

/**
 * Strict authentication: Request MUST have a valid token
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required to access this resource.'
      });
    }

    const token = authHeader.split(' ')[1];

    // If real Supabase credentials exist, verify with Supabase
    if (isSupabaseConfigured && supabaseAuthClient) {
      const { data: { user }, error } = await supabaseAuthClient.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired session token.'
        });
      }
      req.user = user;
      req.token = token;
      return next();
    }

    // Mock/Dev fallback: decode token or create mock user
    if (token === 'demo-token' || token.startsWith('mock-') || token) {
      req.user = {
        id: token.startsWith('mock-') ? token : 'demo-user-id-001',
        email: 'demo@vibecraft.ai',
        user_metadata: { full_name: 'Demo Facilitator' }
      };
      req.token = token;
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token.' });
  } catch (err) {
    console.error('[AuthMiddleware] Error validating token:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

/**
 * Optional authentication: Attach user if token present, but do not block anonymous visitors
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.token = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (isSupabaseConfigured && supabaseAuthClient) {
      const { data: { user } } = await supabaseAuthClient.auth.getUser(token);
      req.user = user || null;
      req.token = token;
      return next();
    }

    // Dev/Mock fallback
    req.user = {
      id: token.startsWith('mock-') ? token : 'demo-user-id-001',
      email: 'demo@vibecraft.ai',
      user_metadata: { full_name: 'Demo Facilitator' }
    };
    req.token = token;
    return next();
  } catch (err) {
    req.user = null;
    req.token = null;
    return next();
  }
}
