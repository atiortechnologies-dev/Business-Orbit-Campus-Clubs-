import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Queue system to handle simultaneous failed requests during refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  // Success Case: Directly return response.data for all API calls
  (response) => response.data,

  // Error Case: Handle 401 Refresh & Formatted Errors
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Access Token)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const requestUrl = originalRequest.url || "";
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/refresh-token");

      if (!isAuthRequest) {
        // If a refresh is already in progress, queue subsequent failed requests
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true },
          );

          // Retry all requests in the queue
          processQueue(null);

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh failed -> session is over, send user to landing page
          if (window.location.pathname !== "/landing") {
            window.location.href = "/landing";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access Forbidden: Invalid Role permissions");
    }

    // Formatted Error Object
    const customError = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    customError.response = error.response;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  },
);

export default api;
