import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { disconnectLiveUpdatesSocket, getLiveUpdatesSocket } from '@/lib/live-updates';

type LiveUpdateEvent = {
  userId: string;
  resources: string[];
  type: 'invalidate' | 'reward';
  reward?: {
    totalXp: number;
    title: string;
  } | null;
};

export function useLiveUpdates(
  userId: string | null,
  onUpdate: (event: LiveUpdateEvent) => void,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  useFocusEffect(
    useCallback(() => {
      if (!enabled || !userId) {
        return undefined;
      }

      const socket = getLiveUpdatesSocket(userId);
      const handler = (event: LiveUpdateEvent) => {
        onUpdate(event);
      };

      socket.on('lifexp:update', handler);

      return () => {
        socket.off('lifexp:update', handler);
      };
    }, [enabled, onUpdate, userId])
  );
}

export { disconnectLiveUpdatesSocket };
