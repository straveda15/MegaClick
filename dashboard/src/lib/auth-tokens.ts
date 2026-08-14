/**
 * auth-tokens — single source of truth for the dashboard's JWT pair.
 *
 * The backend issues a short-lived access token (ACCESS_TOKEN_EXPIRE, default 15m)
 * alongside a long-lived refresh token (REFRESH_TOKEN_EXPIRE, default 7d). Every
 * data hook reads the access token straight out of localStorage via its own
 * authHeaders() helper, so keeping the stored value fresh here transparently fixes
 * all of them without touching a single call site.
 *
 * Two safety nets:
 *   1. AuthContext schedules a proactive refresh shortly before expiry.
 *   2. refreshAccessToken() is single-flight — a burst of parallel 401s triggers
 *      exactly one /auth/refresh call, not one per request.
 */

import { API_BASE } from "../hooks/api-config";

export const TOKEN_KEY = "opsos_access_token";
export const REFRESH_KEY = "opsos_refresh_token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export function setTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * Read the `exp` claim (seconds → ms). Returns null for a malformed token so
 * callers treat it as "expiry unknown" rather than "expired".
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True once the token is within `skewMs` of expiring (default 60s). */
export function isTokenExpiring(token: string, skewMs = 60_000): boolean {
  const exp = getTokenExpiry(token);
  if (exp === null) return false;
  return Date.now() >= exp - skewMs;
}

// ─── Single-flight refresh ────────────────────────────────────────────────────

let inFlight: Promise<string | null> | null = null;

/**
 * Exchange the refresh token for a new access token.
 * Resolves to the new access token, or null when the session is unrecoverable
 * (no refresh token, or the backend rejected it — expired, revoked, deactivated).
 */
export function refreshAccessToken(): Promise<string | null> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        // 401/403/404 → the refresh token itself is dead. Anything else (5xx,
        // network blip) shouldn't nuke a session that may still be valid.
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          clearTokens();
        }
        return null;
      }

      const data = await res.json();
      if (!data.accessToken) return null;

      setTokens(data.accessToken);
      return data.accessToken as string;
    } catch {
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Fetch with the access token attached, transparently refreshing and retrying
 * once on a 401. Use for new call sites; existing hooks are covered by the
 * proactive refresh keeping localStorage current.
 */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const withAuth = (token: string | null): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let token = getAccessToken();
  if (token && isTokenExpiring(token)) {
    token = (await refreshAccessToken()) ?? token;
  }

  const res = await fetch(input, withAuth(token));
  if (res.status !== 401) return res;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return res;

  return fetch(input, withAuth(refreshed));
}
