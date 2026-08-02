import { getMe } from "@/api/auth/authApi";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

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

  const fetchUser = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await getMe();
      setUser(normalizeUser(response));
    } catch (_error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
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

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchUser, handleStorageChange]); // ✅ FIXED: Proper dependencies

  // Optional: Set up interval to refresh user every 10 minutes (keep-alive)
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, isAuthenticated: !!user }}>
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
