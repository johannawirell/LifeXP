import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type SessionMode = 'guest' | 'demo' | 'empty';

type SessionContextValue = {
  mode: SessionMode;
  userId: string | null;
  startDemoMode: () => void;
  startEmptyMode: () => void;
  resetSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('guest');

  const value = useMemo<SessionContextValue>(
    () => ({
      mode,
      userId: mode === 'demo' ? 'demo-auth-user-1' : mode === 'empty' ? 'empty-auth-user-1' : null,
      startDemoMode: () => setMode('demo'),
      startEmptyMode: () => setMode('empty'),
      resetSession: () => setMode('guest'),
    }),
    [mode]
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
