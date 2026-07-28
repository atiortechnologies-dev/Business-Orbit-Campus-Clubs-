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
  (response) => response.data, // Automatically extracts the backend JSON response
  (error) => {
    // Standardize error message extraction from backend response
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  },
);

export default api;
