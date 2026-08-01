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

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Unified Response Interceptor with Better Error Handling
api.interceptors.response.use(
  // Success Case
  (response) => response.data,

  // Error Case
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Token)
    if (error.response?.status === 401 && originalRequest) {
      // Skip refresh for auth routes
      const isAuthRequest =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh-token");

      if (!isAuthRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token, clear storage and redirect
          localStorage.clear();
          sessionStorage.clear();

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
        }

        // If already refreshing, add to queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          // Use standalone axios to avoid interceptor loop
          const res = await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            { refreshToken },
            {
              baseURL: "http://localhost:5000/api",
              withCredentials: true,
            },
          );

          const newAccessToken =
            res.data?.data?.accessToken ||
            res.data?.accessToken ||
            res.data?.data?.token;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);

            // Update the token in the queue
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Process queued requests with new token
            processQueue(null, newAccessToken);

            return api(originalRequest);
          } else {
            throw new Error("No access token in refresh response");
          }
        } catch (refreshError) {
          // Refresh failed - clear storage and redirect
          processQueue(refreshError, null);
          localStorage.clear();
          sessionStorage.clear();

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
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
