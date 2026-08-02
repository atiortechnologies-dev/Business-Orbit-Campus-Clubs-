import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base route for your Express server
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// NOTE: Auth is now handled via httpOnly cookies (accessToken / refreshToken)
// set by the backend on login/register/verify-otp. The browser attaches them
// automatically on every request because of `withCredentials: true` above,
// so there's no request interceptor reading/attaching a token anymore —
// and, importantly, no way for frontend JS to read or tamper with them.

// Single Unified Response Interceptor
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
        try {
          // Refresh token cookie is sent automatically; no body needed.
          // Use direct standalone axios call to avoid interceptor loop.
          await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            {},
            { withCredentials: true },
          );

          // New accessToken cookie has been set by the backend; just retry.
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed -> session is over, send the user to login.
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
