import axios from "axios";

const API_BASE_URL = " http://127.0.0.1:5000/api/users/"; // Replace with your API URL

// Create an Axios instance for default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (optional: for adding tokens, logging, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add Auth Token (if needed)
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Common API methods
const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default apiService;
