import { NativeModules, Platform } from 'react-native';

export class ApiError extends Error {
  status: number;
  url: string;

  constructor(status: number, url: string) {
    super(`Request failed with status ${status} for ${url}`);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
  }
}

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
export const AUTH_BASE_URL = `http://${resolveApiHost()}:3000/api/auth`;

export async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, url);
  }

  return response.json() as Promise<T>;
}

export async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, url);
  }

  return response.json() as Promise<T>;
}

export async function patchJson<T>(path: string, body?: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, url);
  }

  return response.json() as Promise<T>;
}

export async function deleteJson<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new ApiError(response.status, url);
  }

  return response.json() as Promise<T>;
}
