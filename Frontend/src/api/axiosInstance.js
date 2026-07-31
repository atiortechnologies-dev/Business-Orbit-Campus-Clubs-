import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically attach Access Token if present
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

// Automatic token refresh interceptor on 401 response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Or retrieve from cookies
        const res = await refreshAccessToken(refreshToken);

        // Save new access token if stored in local memory/storage
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle permission forbidden error (403)
    if (error.response?.status === 403) {
      console.error("Access Forbidden: Invalid Role permissions");
    }

    return Promise.reject(error);
  },
);

// Response Interceptor: Extract data automatically or handle status code errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );
    customError.response = error.response;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  },
);

export default api;
