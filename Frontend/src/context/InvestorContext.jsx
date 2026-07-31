import React, { createContext, useState, useCallback } from 'react';
import * as investorApi from '../api/investorApi';

export const InvestorContext = createContext(null);

export const InvestorProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err, shouldThrow = true) => {
    const msg = err.response?.data?.message || err.message || "An error occurred";
    setError(msg);
    if (shouldThrow) throw new Error(msg);
  };

  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await investorApi.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWatchlist = useCallback(async (startupId) => {
    setError(null);
    setWatchlist(prev => [...prev, { _id: startupId, startup: { _id: startupId } }]);
    try {
      await investorApi.addToWatchlist(startupId);
    } catch (err) {
      setWatchlist(prev => prev.filter(item => item.startup?._id !== startupId));
      handleError(err, false);
    }
  }, []);

  const removeFromWatchlist = useCallback(async (startupId) => {
    setError(null);
    let removedItem = null;
    setWatchlist(prev => {
      const idx = prev.findIndex(item => item.startup?._id === startupId);
      if (idx > -1) removedItem = prev[idx];
      return prev.filter(item => item.startup?._id !== startupId);
    });
    try {
      await investorApi.removeFromWatchlist(startupId);
    } catch (err) {
      if (removedItem) setWatchlist(prev => [...prev, removedItem]);
      handleError(err, false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await investorApi.getInvestorStats();
      setStats(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const trackPitchView = useCallback(async (startupId) => {
    try {
      await investorApi.trackPitchView(startupId);
    } catch (err) {
      console.error('Failed to track pitch view:', err);
    }
  }, []);

  const value = {
    watchlist,
    stats,
    isLoading,
    error,
    setError,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    fetchStats,
    trackPitchView,
  };

  return (
    <InvestorContext.Provider value={value}>
      {children}
    </InvestorContext.Provider>
  );
};
