import _React, { createContext, useState, useCallback } from "react";
import * as incubationApi from "../api/startup/incubationApi";
import * as submissionApi from "../api/startup/submissionApi";
import * as tractionApi from "../api/startup/tractionApi";
import * as mvpApi from "../api/startup/mvpApi";

export const IncubationContext = createContext(null);

export const IncubationProvider = ({ children }) => {
  // Launch state
  const [launchOverview, setLaunchOverview] = useState(null);
  const [launchChecklist, setLaunchChecklist] = useState(null);
  const [launchSubmission, setLaunchSubmission] = useState(null);

  // Traction state
  const [tractionOverview, setTractionOverview] = useState(null);
  const [tractionChecklist, setTractionChecklist] = useState(null);
  const [tractionMetrics, setTractionMetrics] = useState([]);
  const [tractionSubmission, _setTractionSubmission] = useState(null);
  const [tractionReviewStatus, _setTractionReviewStatus] = useState(null);

  // MVP state
  const [mvpStage, setMvpStage] = useState(null);
  const [mvpChecklist, _setMvpChecklist] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err, shouldThrow = true) => {
    const msg =
      err.response?.data?.message || err.message || "An error occurred";
    setError(msg);
    if (shouldThrow) throw new Error(msg);
  };

  // Launch methods
  const fetchLaunchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incubationApi.getLaunchOverview();
      setLaunchOverview(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLaunchChecklist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incubationApi.getLaunchChecklist();
      setLaunchChecklist(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLaunchSubmission = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incubationApi.getLaunchSubmission();
      setLaunchSubmission(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitLaunch = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await submissionApi.submitLaunch(payload);
        await fetchLaunchSubmission();
        await fetchLaunchOverview();
        return res;
      } catch (err) {
        handleError(err, true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLaunchSubmission, fetchLaunchOverview],
  );

  const saveLaunchDraft = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await submissionApi.saveLaunchDraft(payload);
        await fetchLaunchSubmission();
        return res;
      } catch (err) {
        handleError(err, true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLaunchSubmission],
  );

  // Traction methods
  const fetchTractionOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incubationApi.getTractionOverview();
      setTractionOverview(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTractionChecklist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incubationApi.getTractionChecklist();
      setTractionChecklist(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTractionMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tractionApi.getTractionMetrics();
      setTractionMetrics(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTractionMetric = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        // Optimistic update
        setTractionMetrics((prev) => [...prev, payload]);
        const res = await tractionApi.addTractionMetric(payload);
        await fetchTractionMetrics();
        return res;
      } catch (err) {
        // Revert optimistic update? For simplicity just handle error
        handleError(err, true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTractionMetrics],
  );

  const submitTraction = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await tractionApi.submitTraction(payload);
        await fetchTractionOverview();
        return res;
      } catch (err) {
        handleError(err, true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTractionOverview],
  );

  // MVP methods
  const fetchMvpStage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mvpApi.getMvpStage();
      setMvpStage(data);
    } catch (err) {
      handleError(err, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    launchOverview,
    launchChecklist,
    launchSubmission,
    tractionOverview,
    tractionChecklist,
    tractionMetrics,
    tractionSubmission,
    tractionReviewStatus,
    mvpStage,
    mvpChecklist,
    isLoading,
    error,
    setError,
    fetchLaunchOverview,
    fetchLaunchChecklist,
    fetchLaunchSubmission,
    submitLaunch,
    saveLaunchDraft,
    fetchTractionOverview,
    fetchTractionChecklist,
    fetchTractionMetrics,
    addTractionMetric,
    submitTraction,
    fetchMvpStage,
  };

  return (
    <IncubationContext.Provider value={value}>
      {children}
    </IncubationContext.Provider>
  );
};
