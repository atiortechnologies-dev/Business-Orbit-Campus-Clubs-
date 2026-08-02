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
      setUser(normalizedUser ?? null);
    } catch (error) {
      setUser(null);
      return null;
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
    } catch (error) {
      // Even if the request fails, clear local state so the UI reflects
      // a logged-out user; the cookies will simply expire on their own.
    } finally {
      setUser(null);
      setLoading(false);
    }

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchUser, handleStorageChange]); // ✅ FIXED: Proper dependencies

  // Optional: Set up interval to refresh user every 10 minutes (keep-alive)
  useEffect(() => {
    fetchUser({ silent: true });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
