import { getMe } from "@/api/auth/authApi";
import { getStoredAccessToken } from "@/api/auth/tokenStorage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getMe();
      const userPayload = response?.data?.user || response?.user || response?.data || null;
      setUser(userPayload && typeof userPayload === "object" ? userPayload : null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleAuthStateChange = () => {
      fetchUser();
    };

    window.addEventListener("auth:login", handleAuthStateChange);
    window.addEventListener("auth:logout", handleAuthStateChange);

    return () => {
      window.removeEventListener("auth:login", handleAuthStateChange);
      window.removeEventListener("auth:logout", handleAuthStateChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
