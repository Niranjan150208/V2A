import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isCloudSyncEnabled } from '../services/supabase';
import { AppStore } from '../services/store';
import type { User as AppUser } from '../types';

const DEMO_MODE_KEY = 'v2a_demo_mode';

interface AuthContextValue {
  cloudEnabled: boolean;
  session: Session | null;
  authInitialized: boolean;
  ready: boolean;
  demoMode: boolean;
  setupError: string | null;
  passwordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ confirmationRequired: boolean }>;
  signOut: () => Promise<string | null>;
  startDemo: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function debugAuth(message: string): void {
  if (import.meta.env.DEV) console.debug(`[AUTH] ${message}`);
}

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function activateSavedDemo(): void {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
  AppStore.activateDemoMode();
}

function toAppUser(sessionUser: Session['user']): AppUser {
  const metadata = sessionUser.user_metadata;
  const name =
    typeof metadata.full_name === 'string' && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : sessionUser.email?.split('@')[0] || 'Farmer';
  return {
    id: sessionUser.id,
    phone: sessionUser.phone ?? '',
    name,
    tamilName: typeof metadata.tamil_name === 'string' ? metadata.tamil_name : undefined,
    role: 'farmer',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const cloudEnabled = isCloudSyncEnabled;
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(!cloudEnabled);
  const [ready, setReady] = useState(!cloudEnabled);
  const [demoMode, setDemoMode] = useState(() => !cloudEnabled || localStorage.getItem(DEMO_MODE_KEY) === 'true');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const activatedUserId = useRef<string | null>(null);
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    if (!supabase) {
      activateSavedDemo();
      return;
    }

    let disposed = false;
    let authEventRevision = 0;
    let initialSessionEventReceived = false;
    let initialSessionSettled = false;
    let authChangeAfterInitialSession = false;
    const handleSession = (nextSession: Session | null) => {
      if (disposed) return;
      const nextUserId = nextSession?.user.id ?? null;

      if (nextUserId) {
        debugAuth("Session established.");
        localStorage.removeItem(DEMO_MODE_KEY);
        setDemoMode(false);
        if (activatedUserId.current !== nextUserId) {
          AppStore.clearCloudUser();
          activatedUserId.current = nextUserId;
          setSetupError(null);
          setReady(false);
        }
      } else {
        debugAuth("No active session.");
        const resumeDemo = localStorage.getItem(DEMO_MODE_KEY) === 'true';
        activatedUserId.current = null;
        AppStore.clearCloudUser();
        setDemoMode(resumeDemo);
        if (resumeDemo) AppStore.activateDemoMode();
        setSetupError(null);
        setReady(true);
      }
      sessionRef.current = nextSession;
      setSession(nextSession);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'INITIAL_SESSION') {
        if (initialSessionEventReceived || initialSessionSettled || authChangeAfterInitialSession) return;
        initialSessionEventReceived = true;
        initialSessionSettled = true;
      } else {
        authChangeAfterInitialSession = true;
      }
      authEventRevision += 1;
      setAuthInitialized(true);
      debugAuth(`State changed: ${event}.`);
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      if (event === 'SIGNED_OUT') setPasswordRecovery(false);
      handleSession(nextSession);
    });

    const initialEventRevision = authEventRevision;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (disposed || authEventRevision !== initialEventRevision) return;
      if (error) {
        setSetupError(`Unable to check your sign-in session: ${error.message}`);
        setReady(true);
        setAuthInitialized(true);
        return;
      }
      initialSessionSettled = true;
      handleSession(data.session);
      setAuthInitialized(true);
    }).catch((error: unknown) => {
      if (disposed || authEventRevision !== initialEventRevision) return;
      setSetupError(`Unable to check your sign-in session: ${getAuthErrorMessage(error, 'Please try again.')}`);
      setReady(true);
      setAuthInitialized(true);
    });

    return () => {
      disposed = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const sessionUserId = session?.user.id;
  useEffect(() => {
    const authUser = sessionRef.current?.user;
    if (!supabase || !authUser || authUser.id !== sessionUserId) return;

    let cancelled = false;
    const user = toAppUser(authUser);
    void AppStore.activateCloudUser(user).then(() => {
      if (cancelled) return;
      activatedUserId.current = user.id;
      setSetupError(null);
      debugAuth("Account data loaded.");
    }).catch((error: unknown) => {
      if (cancelled) return;
      debugAuth("Account data could not be loaded.");
      setSetupError(`Unable to load your account data: ${getAuthErrorMessage(error, 'Please try again.')}`);
    }).finally(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionUserId]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Cloud sign-in is not configured. You can continue with the local demo.');
    debugAuth("Password sign-in started.");
    setReady(false);
    setSetupError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session?.user.id) throw new Error('Sign-in completed without an active session. Please try again.');
      localStorage.removeItem(DEMO_MODE_KEY);
      setDemoMode(false);
      activatedUserId.current = data.session.user.id;
      sessionRef.current = data.session;
      setSession(data.session);
      setAuthInitialized(true);
      debugAuth("Password sign-in succeeded; waiting for account data.");
    } catch (error) {
      setReady(true);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!supabase) throw new Error('Cloud sign-up is not configured. You can continue with the local demo.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: displayName.trim() } },
    });
    if (error) throw error;
    if (data.session) {
      localStorage.removeItem(DEMO_MODE_KEY);
      setDemoMode(false);
      activatedUserId.current = data.session.user.id;
      setReady(false);
      sessionRef.current = data.session;
      setSession(data.session);
    }
    return { confirmationRequired: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    let syncError: unknown = null;
    if (session && supabase) {
      try {
        await AppStore.flushCloudSync();
      } catch (error) {
        syncError = error;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }

    localStorage.removeItem(DEMO_MODE_KEY);
    sessionRef.current = null;
    setSession(null);
    setDemoMode(false);
    setPasswordRecovery(false);
    setSetupError(null);
    activatedUserId.current = null;
    AppStore.clearCloudUser();

    if (syncError) {
      return 'You are signed out, but the latest changes may not have synced. Sign in again when online to retry.';
    }
    return null;
  }, [session]);

  const startDemo = useCallback(async () => {
    if (session && supabase) {
      let syncError: unknown = null;
      try {
        await AppStore.flushCloudSync();
      } catch (error) {
        syncError = error;
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (syncError) {
        throw new Error('Your account has been signed out, but some changes may not have synced. Please reconnect and sign in again before using demo mode.');
      }
    }

    activateSavedDemo();
    activatedUserId.current = null;
    sessionRef.current = null;
    setSession(null);
    setDemoMode(true);
    setPasswordRecovery(false);
    setSetupError(null);
    setReady(true);
  }, [session]);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Password recovery is not configured.');
    const redirectTo = `${window.location.origin}/#/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) throw new Error('Password updates are not configured.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    setPasswordRecovery(false);
    sessionRef.current = null;
    setSession(null);
    setDemoMode(false);
    setReady(true);
    AppStore.clearCloudUser();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    cloudEnabled,
    session,
    authInitialized,
    ready,
    demoMode,
    setupError,
    passwordRecovery,
    signIn,
    signUp,
    signOut,
    startDemo,
    sendPasswordReset,
    updatePassword,
  }), [cloudEnabled, session, authInitialized, ready, demoMode, setupError, passwordRecovery, signIn, signUp, signOut, startDemo, sendPasswordReset, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
