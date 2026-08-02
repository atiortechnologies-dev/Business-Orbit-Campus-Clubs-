import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're already refreshing to prevent multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue = [];

// Add state for queuing requests during token refresh
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

// Single Unified Response Interceptor
api.interceptors.response.use(
  // Success Case
  (response) => response.data,

  // Error Case
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Access Token)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const requestUrl = originalRequest.url || "";
      
      const authRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh-token",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/send-otp",
        "/auth/verify-otp",
        "/auth/check-email"
      ];
      
      const isAuthRequest = authRoutes.some(route => requestUrl.includes(route));

      if (!isAuthRequest) {
        // If the frontend doesn't even think it's logged in, don't bother trying to refresh!
        // This prevents the console error `POST /auth/refresh-token 401` on fresh page load.
        if (localStorage.getItem("isLoggedIn") !== "true") {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return api(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Refresh token cookie is sent automatically; no body needed.
          // Use direct standalone axios call to avoid interceptor loop.
          await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            {},
            { withCredentials: true },
          );

          // New accessToken cookie has been set by the backend.
          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed -> session is over, send the user to login.
          processQueue(refreshError, null);
          localStorage.removeItem("isLoggedIn");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
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
      if (window.location.pathname !== "/unauthorized") {
        window.location.href = "/unauthorized";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    }

    // Format error object
    const customError = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    customError.response = error.response;
    customError.data = error.response?.data;
    customError.status = error.response?.status;

    return Promise.reject(customError);
  },
);

export default api;
