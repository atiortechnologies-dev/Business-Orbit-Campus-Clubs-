import { getMe, logoutUser } from "@/api/auth/authApi";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

const normalizeUser = (response) => {
  const payload = response?.data ?? response;

  if (!payload || typeof payload !== "object") return null;
  if (payload.success === false) return null;

  const candidate = payload.user ?? payload.data ?? payload;

  if (!candidate || typeof candidate !== "object") return null;

  if (candidate.user || candidate.data) {
    return candidate.user ?? candidate.data ?? null;
  }

  return candidate;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await getMe();
      const normalizedUser = normalizeUser(response);
      if (normalizedUser) {
        localStorage.setItem("isLoggedIn", "true");
        setUser(normalizedUser);
        return normalizedUser;
      } else {
        localStorage.removeItem("isLoggedIn");
        setUser(null);
        return null;
      }
    } catch {
      localStorage.removeItem("isLoggedIn");
      setUser(null);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  // Clears the httpOnly auth cookies on the backend (frontend JS can't read
  // or delete them directly) and resets local user state.
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the request fails, clear local state so the UI reflects
      // a logged-out user; the cookies will simply expire on their own.
    } finally {
      localStorage.removeItem("isLoggedIn");
      setUser(null);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Only fetch silently on mount
    fetchUser({ silent: true }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, [fetchUser]);

  const value = {
    user,
    setUser,
    loading,
    fetchUser,
    logout,
    isAuthenticated: !!user && localStorage.getItem("isLoggedIn") === "true",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
