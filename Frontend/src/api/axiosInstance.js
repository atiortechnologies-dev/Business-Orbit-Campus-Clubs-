import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base route for your Express server
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

// Response Interceptor: Extract data automatically or handle status code errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Global 401 Unauthorized handling
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      // Exclude login and auth checking endpoints from forcing a redirect
      if (!url.includes("/auth/login") && !url.includes("/auth/me")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
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
