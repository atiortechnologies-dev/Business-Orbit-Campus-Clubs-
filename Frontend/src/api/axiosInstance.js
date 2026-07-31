import axios from "axios";
import {
  clearAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthTokens,
} from "./auth/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise = null;

const shouldRedirectToLogin = () => {
  if (typeof window === "undefined") return false;

  const publicPaths = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/onboarding/welcome",
    "/role-selection",
    "/student-signup",
    "/company-signup",
    "/investor-signup",
    "/mentor-signup",
    "/incubator-signup",
    "/landing",
    "/privacy-policy",
    "/unauthorized",
  ];

  return !publicPaths.includes(window.location.pathname);
};

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization;
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
        const refreshToken = getStoredRefreshToken();

        if (!refreshToken) {
          clearAuthTokens();

          if (shouldRedirectToLogin()) {
            window.location.replace("/login");
          }

          return Promise.reject(new Error("No refresh token available."));
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axios
            .post("http://localhost:5000/api/auth/refresh-token", {
              refreshToken,
            })
            .then((res) => {
              const newAccessToken =
                res?.data?.data?.accessToken ||
                res?.data?.accessToken ||
                res?.accessToken ||
                res?.data?.data?.token;
              const newRefreshToken =
                res?.data?.data?.refreshToken ||
                res?.data?.refreshToken ||
                res?.refreshToken ||
                refreshToken;

              if (!newAccessToken) {
                throw new Error("Refresh token response did not include a new access token.");
              }

              persistAuthTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });

              return newAccessToken;
            })
            .catch((refreshError) => {
              clearAuthTokens();

              if (shouldRedirectToLogin()) {
                window.location.replace("/login");
              }

              throw refreshError;
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        try {
          const newAccessToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }

    if (error.response?.status === 403) {
      console.error("Access Forbidden: Invalid Role permissions");
    }

    const customError = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    customError.response = error.response;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  },
);

export default api;
