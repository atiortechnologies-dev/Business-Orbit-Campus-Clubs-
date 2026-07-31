import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { adminSettingsApi, adminAuditLogApi } from "../api/admin/adminApi";

const AdminDashboardContext = createContext();

export const useAdminDashboard = () => useContext(AdminDashboardContext);

export const AdminDashboardProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pulse, setPulse] = useState(null);
  const [volumeTrend, setVolumeTrend] = useState([]);

  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setError(null);
    setIsLoadingSettings(true);
    try {
      const res = await adminSettingsApi.getSettings();
      setSettings(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError(err.response?.data?.message || "Failed to fetch settings");
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async (params = {}) => {
    setError(null);
    setIsLoadingLogs(true);
    try {
      const [logsRes, pulseRes, trendRes] = await Promise.all([
        adminAuditLogApi.getLogs(params),
        adminAuditLogApi.getPulse(),
        adminAuditLogApi.getVolumeTrend(),
      ]);
      setAuditLogs(logsRes.data.data || logsRes.data);
      setPulse(pulseRes.data.data || pulseRes.data);
      setVolumeTrend(trendRes.data.data || trendRes.data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(err.response?.data?.message || "Failed to fetch audit logs");
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  const updatePlatformSettings = async (data) => {
    setError(null);
    const previousSettings = settings;
    setSettings((prev) => ({
      ...prev,
      platform: { ...prev?.platform, ...data },
    }));
    try {
      await adminSettingsApi.updatePlatformSettings(data);
      // Let the optimistic update hold, fetch in background just to sync
      fetchSettings();
    } catch (err) {
      setSettings(previousSettings);
      setError(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  const updateProfile = async (data) => {
    setError(null);
    const previousSettings = settings;
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev?.profile, ...data },
    }));
    try {
      await adminSettingsApi.updateProfile(data);
      fetchSettings();
    } catch (err) {
      setSettings(previousSettings);
      setError(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  const updateNotifications = async (data) => {
    setError(null);
    const previousSettings = settings;
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev?.notifications, ...data },
    }));
    try {
      await adminSettingsApi.updateNotifications(data);
      fetchSettings();
    } catch (err) {
      setSettings(previousSettings);
      setError(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchSettings();
    // Don't fetch logs immediately to save DB if they don't visit the log page.
    // They can trigger fetchAuditLogs manually when they visit AuditLog.jsx.
  }, [fetchSettings]);

  const value = {
    settings,
    auditLogs,
    pulse,
    volumeTrend,
    isLoadingSettings,
    isLoadingLogs,
    error,
    fetchSettings,
    fetchAuditLogs,
    updatePlatformSettings,
    updateProfile,
    updateNotifications,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
