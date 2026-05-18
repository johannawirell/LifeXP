import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type UseLiveRefreshOptions = {
  enabled?: boolean;
  intervalMs?: number;
};

export function useLiveRefresh(callback: () => void | Promise<void>, options?: UseLiveRefreshOptions) {
  const enabled = options?.enabled ?? true;
  const intervalMs = options?.intervalMs ?? 5000;

  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return undefined;
      }

      void callback();
      const intervalId = setInterval(() => {
        void callback();
      }, intervalMs);

      return () => {
        clearInterval(intervalId);
      };
    }, [callback, enabled, intervalMs])
  );
}
