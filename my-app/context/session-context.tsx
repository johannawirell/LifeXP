import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type SessionMode = 'guest' | 'demo' | 'empty' | 'authenticated';

type AuthSessionPayload = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  provider: string;
};

type SessionContextValue = {
  mode: SessionMode;
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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('guest');
  const [authSession, setAuthSession] = useState<AuthSessionPayload | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      mode,
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
        setAuthSession(null);
        setMode('demo');
      },
      startEmptyMode: () => {
        setAuthSession(null);
        setMode('empty');
      },
      startAuthenticatedSession: (payload) => {
        setAuthSession(payload);
        setMode('authenticated');
      },
      resetSession: () => {
        setAuthSession(null);
        setMode('guest');
      },
    }),
    [authSession, mode]
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
