import { getMe } from "@/api/auth/authApi";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  const tokenRefreshPromiseRef = useRef(null); // Prevent concurrent refreshes

  // Fetch user from API
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
      return null;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []); // ✅ FIXED: No external dependencies

  // Handle storage changes across tabs
  const handleStorageChange = useCallback(
    (e) => {
      // If tokens were cleared in another tab
      if (
        (e.key === "accessToken" || e.key === "refreshToken") &&
        !e.newValue
      ) {
        setUser(null);
        setLoading(false);
      }

      // If any auth-related storage changed, refetch user silently
      if (
        e.key === "accessToken" ||
        e.key === "refreshToken" ||
        e.key === null
      ) {
        // null key means storage was cleared
        fetchUser({ silent: true }).catch(() => {
          setUser(null);
        });
      }
    },
    [fetchUser],
  );

  // Initialize on mount
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Try to fetch user data, but allow rendering to proceed
      fetchUser({ silent: true }).catch(() => {
        setUser(null);
        setLoading(false);
      });
    } else {
      setUser(null);
      setLoading(false);
    }

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

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchUser, handleStorageChange]); // ✅ FIXED: Proper dependencies

  // Optional: Set up interval to refresh user every 10 minutes (keep-alive)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(
      () => {
        fetchUser({ silent: true }).catch(() => {
          setUser(null);
        });
      },
      10 * 60 * 1000,
    ); // 10 minutes

    return () => clearInterval(interval);
  }, [user, fetchUser]);

  const value = {
    user,
    setUser,
    loading,
    fetchUser,
    isAuthenticated: !!user && !!localStorage.getItem("accessToken"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
