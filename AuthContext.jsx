import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    // 1. If Supabase is configured, subscribe to auth changes
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Check for local demo session if offline
      const savedDemoUser = localStorage.getItem('vibecraft_demo_user');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          setSession({ access_token: 'demo-token', user: parsed });
        } catch (e) {}
      }
      setLoading(false);
    }
  }, []);

  const openAuthModal = (view = 'signin') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toastError(error.message);
        throw error;
      }
      success(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`);
      closeAuthModal();
      return data;
    } else {
      // Demo authentication
      const demoProfile = {
        id: `user-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        user_metadata: { full_name: email.split('@')[0] }
      };
      setUser(demoProfile);
      setSession({ access_token: 'demo-token', user: demoProfile });
      localStorage.setItem('vibecraft_demo_user', JSON.stringify(demoProfile));
      success(`Signed in as ${demoProfile.user_metadata.full_name} (Demo Mode)`);
      closeAuthModal();
      return { user: demoProfile };
    }
  };

  const signUp = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        toastError(error.message);
        throw error;
      }
      success('Account created! Please check your email to verify if required.');
      closeAuthModal();
      return data;
    } else {
      const demoProfile = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: { full_name: fullName || email.split('@')[0] }
      };
      setUser(demoProfile);
      setSession({ access_token: 'demo-token', user: demoProfile });
      localStorage.setItem('vibecraft_demo_user', JSON.stringify(demoProfile));
      success(`Account created for ${demoProfile.user_metadata.full_name}!`);
      closeAuthModal();
      return { user: demoProfile };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('vibecraft_demo_user');
    setUser(null);
    setSession(null);
    info('Signed out successfully.');
  };

  const demoLogin = (role = 'Team Lead') => {
    const demoUser = {
      id: 'demo-facilitator-001',
      email: 'alex.facilitator@vibecraft.ai',
      user_metadata: {
        full_name: 'Alex Morgan',
        role: role,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
      }
    };
    setUser(demoUser);
    setSession({ access_token: 'demo-token', user: demoUser });
    localStorage.setItem('vibecraft_demo_user', JSON.stringify(demoUser));
    success(`Logged in as demo facilitator (${demoUser.user_metadata.full_name})!`);
    closeAuthModal();
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) {
        toastError(error.message);
        throw error;
      }
      success('Password reset email sent! Check your inbox.');
      closeAuthModal();
    } else {
      info('Password reset simulation: In demo mode, simply re-sign in.');
      closeAuthModal();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        token: session?.access_token || 'demo-token',
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
        demoLogin,
        resetPassword,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
