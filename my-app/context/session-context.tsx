import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { disconnectLiveUpdatesSocket } from '@/lib/live-updates';

type SessionMode = 'guest' | 'demo' | 'empty' | 'authenticated';

type AuthSessionPayload = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  provider: string;
};

type SessionContextValue = {
  mode: SessionMode;
  isHydrating: boolean;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  authProvider: string | null;
  startDemoMode: () => void;
  startEmptyMode: () => void;
  startAuthenticatedSession: (payload: AuthSessionPayload) => void;
  resetSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);
const SESSION_STORAGE_KEY = 'lifexp.session';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('guest');
  const [authSession, setAuthSession] = useState<AuthSessionPayload | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const rawSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

        if (!rawSession) {
          return;
        }

        const parsed = JSON.parse(rawSession) as { mode: SessionMode; authSession: AuthSessionPayload | null };
        setMode(parsed.mode ?? 'guest');
        setAuthSession(parsed.authSession ?? null);
      } catch {
        setMode('guest');
        setAuthSession(null);
      } finally {
        setIsHydrating(false);
      }
    };

    void hydrateSession();
  }, []);

  const persistSession = async (nextMode: SessionMode, nextAuthSession: AuthSessionPayload | null) => {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        mode: nextMode,
        authSession: nextAuthSession,
      })
    );
  };

  const clearSession = async () => {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = useMemo<SessionContextValue>(
    () => ({
      mode,
      isHydrating,
      userId:
        mode === 'demo'
          ? 'demo-auth-user-1'
          : mode === 'empty'
            ? 'empty-auth-user-1'
            : mode === 'authenticated'
              ? authSession?.userId ?? null
              : null,
      accessToken: authSession?.accessToken ?? null,
      refreshToken: authSession?.refreshToken ?? null,
      authProvider: authSession?.provider ?? null,
      startDemoMode: () => {
        disconnectLiveUpdatesSocket();
        setAuthSession(null);
        setMode('demo');
        void persistSession('demo', null);
      },
      startEmptyMode: () => {
        disconnectLiveUpdatesSocket();
        setAuthSession(null);
        setMode('empty');
        void persistSession('empty', null);
      },
      startAuthenticatedSession: (payload) => {
        disconnectLiveUpdatesSocket();
        setAuthSession(payload);
        setMode('authenticated');
        void persistSession('authenticated', payload);
      },
      resetSession: () => {
        disconnectLiveUpdatesSocket();
        setAuthSession(null);
        setMode('guest');
        void clearSession();
      },
    }),
    [authSession, isHydrating, mode]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
