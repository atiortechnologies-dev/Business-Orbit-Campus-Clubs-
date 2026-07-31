import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// 2. Single Unified Response Interceptor
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
      originalRequest._retry = true;

      const requestUrl = originalRequest.url || "";
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/refresh-token");

      if (!isAuthRequest) {
        const refreshToken = localStorage.getItem("refreshToken");

        // If no refresh token exists, redirect without making extra API calls
        if (!refreshToken) {
          localStorage.clear();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(new Error("No refresh token available."));
        }

        try {
          // Use direct standalone axios call to avoid interceptor loop
          const res = await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            {
              refreshToken,
            },
          );

          // Check all common response shapes
          const newAccessToken =
            res.data?.data?.accessToken ||
            res.data?.accessToken ||
            res.data?.data?.token;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);

            // Re-attach new token to headers & retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed -> clear session & redirect to login
          localStorage.clear();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access Forbidden: Invalid Role permissions");
    }

    // Formatted Error Object (preserves error.response and error.data for components)
    const customError = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    customError.response = error.response;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  },
);

export default api;
