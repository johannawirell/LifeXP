import { NativeModules, Platform } from 'react-native';

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

export const API_BASE_URL = `http://${resolveApiHost()}:3000/api`;

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${API_BASE_URL}${path}`);
  }

  return response.json() as Promise<T>;
}
