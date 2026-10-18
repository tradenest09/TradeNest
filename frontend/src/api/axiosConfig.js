import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Skip attaching Authorization header for login and register endpoints
    const isAuthEndpoint = config.url && (config.url.includes('/login') || config.url.includes('/register'));

    if (token && token !== "undefined" && token !== "null" && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Allow the browser to automatically set the Content-Type with a boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
