import { NativeModules, Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';

function resolveApiHost() {
  if (Platform.OS === 'web') {
    return 'localhost';
  }

  const scriptURL = NativeModules.SourceCode?.scriptURL as string | undefined;

  if (scriptURL) {
    try {
      const { hostname } = new URL(scriptURL);

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      }

      return hostname;
    } catch {
      return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    }
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const LIVE_UPDATES_URL = `http://${resolveApiHost()}:3000`;

let socket: Socket | null = null;

export function getLiveUpdatesSocket(userId: string) {
  if (!socket) {
    socket = io(LIVE_UPDATES_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }

  socket.auth = {
    userId,
  };

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit('subscribe', { userId });

  return socket;
}

export function disconnectLiveUpdatesSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
