import { createContext, useContext, useState, useCallback } from "react";
import { mentorshipApi } from "@/api/mentorshipApi";

const MentorshipContext = createContext(null);

export const MentorshipProvider = ({ children }) => {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMentors = useCallback(async (filters = {}) => {
    setError(null);
    setLoading(true);
    try {
      const response = await mentorshipApi.getMentors(filters);
      setMentors(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  }, []);

  const requestMentorship = useCallback(async (mentorId, data) => {
    setError(null);
    // Optimistic Update: adding placeholder object
    const optimisticRequest = {
      _id: Date.now().toString(),
      mentorId,
      status: "pending",
      ...data,
    };
    setRequests((prev) => [...prev, optimisticRequest]);

    try {
      const response = await mentorshipApi.requestMentorship(mentorId, data);
      // Replace optimistic request with real response
      setRequests((prev) =>
        prev.map((req) =>
          req._id === optimisticRequest._id ? response.data : req,
        ),
      );
      return response.data;
    } catch (err) {
      // Revert optimistic update
      setRequests((prev) =>
        prev.filter((req) => req._id !== optimisticRequest._id),
      );
      setError(err.message || "Failed to request mentorship");
      throw err;
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await mentorshipApi.getMentorshipRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequestStatus = useCallback(
    async (requestId, status) => {
      setError(null);
      // Optimistic Update
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status } : req)),
      );
      try {
        await mentorshipApi.updateRequestStatus(requestId, status);
      } catch (err) {
        // Revert on failure
        fetchRequests();
        setError(err.message || "Failed to update request");
        throw err;
      }
    },
    [fetchRequests],
  );

  const fetchMeetings = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await mentorshipApi.getMeetings();
      setMeetings(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleMeeting = useCallback(async (data) => {
    setError(null);
    // Optimistic Update
    const optimisticMeeting = {
      _id: Date.now().toString(),
      status: "scheduled",
      ...data,
    };
    setMeetings((prev) => [...prev, optimisticMeeting]);
    try {
      const response = await mentorshipApi.scheduleMeeting(data);
      setMeetings((prev) =>
        prev.map((m) => (m._id === optimisticMeeting._id ? response.data : m)),
      );
      return response.data;
    } catch (err) {
      setMeetings((prev) =>
        prev.filter((m) => m._id !== optimisticMeeting._id),
      );
      setError(err.message || "Failed to schedule meeting");
      throw err;
    }
  }, []);

  return (
    <MentorshipContext.Provider
      value={{
        mentors,
        requests,
        meetings,
        loading,
        error,
        fetchMentors,
        requestMentorship,
        fetchRequests,
        updateRequestStatus,
        fetchMeetings,
        scheduleMeeting,
        setError,
      }}
    >
      {children}
    </MentorshipContext.Provider>
  );
};

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error("useMentorship must be used within a MentorshipProvider");
  }
  return context;
};
