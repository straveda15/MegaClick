import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { disconnectSocket } from "../hooks/useSocket";
import { API_BASE } from "../hooks/api-config";
import {
  getAccessToken,
  setTokens,
  clearTokens,
  getTokenExpiry,
  refreshAccessToken,
} from "../lib/auth-tokens";

interface AdminUser {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  role: "admin" | "employee" | "production_staff" | string;
  departmentRole: string | null;
  isSalesManager: boolean;
  operationalRoles: string[];
  currentOperationalRole: string | null;
  allowedPaths: string[];
  isPhoneVerified: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (
    credentials: AdminLoginCredentials | EmployeeLoginCredentials,
    mode: "admin" | "employee"
  ) => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  logout: () => void;
}

interface AdminLoginCredentials {
  phone?: string;
  countryCode?: string;
  email?: string;
  password: string;
}

interface EmployeeLoginCredentials {
  phone?: string;
  countryCode?: string;
  email?: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ALLOWED_ROLES = ["admin", "employee", "production_staff", "dispatch_staff"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Schedule a refresh one minute before the access token expires, so the value
   * every data hook reads out of localStorage never goes stale mid-session.
   * Re-arms itself after each successful refresh.
   */
  const scheduleRefresh = (token: string) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    const exp = getTokenExpiry(token);
    if (exp === null) return;

    // Floor at 5s so a near-expired token still refreshes instead of spinning.
    const delay = Math.max(exp - Date.now() - 60_000, 5_000);
    refreshTimer.current = setTimeout(async () => {
      const next = await refreshAccessToken();
      if (next) {
        setAccessToken(next);
        scheduleRefresh(next);
      } else {
        // Refresh token is gone or rejected — end the session cleanly rather
        // than leaving a logged-in-looking shell that 401s on every request.
        logout();
      }
    }, delay);
  };

  // On mount — restore session from localStorage and verify with backend
  useEffect(() => {
    const init = async () => {
      let token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const fetchMe = (t: string) =>
        fetch(`${API_BASE}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${t}` },
        });

      try {
        let res = await fetchMe(token);

        // Access token expired — try the refresh token before giving up.
        if (res.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            token = refreshed;
            res = await fetchMe(refreshed);
          }
        }

        const data = await res.json();
        const restored = data.data?.user;
        if (res.ok && ALLOWED_ROLES.includes(restored?.role)) {
          setUser(normalizeUser(restored));
          setAccessToken(token);
          scheduleRefresh(token);
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }
      setLoading(false);
    };
    init();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  /**
   * Normalise raw API user shape → AdminUser.
   * Guarantees operationalRoles is always an array and
   * currentOperationalRole is always a string | null.
   */
  const normalizeUser = (raw: Partial<AdminUser> & Record<string, unknown>): AdminUser => ({
    _id: raw._id as string,
    name: (raw.name as string) ?? "",
    lastName: (raw.lastName as string) ?? "",
    phone: (raw.phone as string) ?? "",
    email: (raw.email as string) ?? "",
    role: (raw.role as string) ?? "",
    departmentRole: (raw.departmentRole as string | null) ?? null,
    isSalesManager: (raw.isSalesManager as boolean) ?? false,
    operationalRoles: Array.isArray(raw.operationalRoles) ? raw.operationalRoles : [],
    currentOperationalRole: (raw.currentOperationalRole as string | null) ?? null,
    allowedPaths: Array.isArray(raw.allowedPaths) ? (raw.allowedPaths as string[]) : [],
    isPhoneVerified: (raw.isPhoneVerified as boolean) ?? false,
  });

  const login = async (
    credentials: AdminLoginCredentials | EmployeeLoginCredentials,
    mode: "admin" | "employee"
  ) => {
    const endpoint =
      mode === "admin"
        ? `${API_BASE}/api/v1/auth/admin/login`
        : `${API_BASE}/api/v1/auth/employee/login`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    // Persist BOTH tokens — the refresh token is what keeps the session alive
    // past the 15-minute access token expiry.
    setTokens(data.accessToken, data.refreshToken);
    setAccessToken(data.accessToken);
    setUser(normalizeUser(data.user));
    scheduleRefresh(data.accessToken);
  };

  /**
   * Employee-only: switch the active operational role.
   * Calls POST /v1/users/select-role and updates the user state locally.
   */
  const switchRole = async (role: string) => {
    if (!accessToken) throw new Error("Not authenticated.");

    const res = await fetch(`${API_BASE}/api/v1/users/select-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Role switch failed");

    // Patch only currentOperationalRole so no full re-fetch is needed
    setUser((prev) => (prev ? { ...prev, currentOperationalRole: role } : prev));
  };

  const logout = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    clearTokens();
    setUser(null);
    setAccessToken(null);
    disconnectSocket(); // close WebSocket on logout
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};