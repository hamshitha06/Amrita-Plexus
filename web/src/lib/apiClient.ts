import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ApiOptions = RequestInit & { skipAuth?: boolean };

/**
 * API client that automatically adds the Bearer token
 * and retries once on 401 with a silent token refresh.
 */
export function useApiClient() {
  const { getAccessToken, refreshTokens } = useAuth();

  async function apiFetch<T>(
    path: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const makeRequest = async (token: string | null): Promise<Response> => {
      return fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...fetchOptions.headers,
        },
      });
    };

    let token = skipAuth ? null : await getAccessToken();
    let res = await makeRequest(token);

    // On 401, attempt a silent refresh and retry once
    if (res.status === 401 && !skipAuth) {
      token = await refreshTokens();
      res = await makeRequest(token);
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: { code: 'UNKNOWN', message: res.statusText } }));
      throw body;
    }

    return res.json() as Promise<T>;
  }

  return { apiFetch };
}

/** Standalone (non-hook) API call for server-side use or outside React */
export async function apiFetchStandalone<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { code: 'UNKNOWN', message: res.statusText } }));
    throw body;
  }

  return res.json() as Promise<T>;
}
