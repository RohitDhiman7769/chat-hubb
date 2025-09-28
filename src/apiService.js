import axios from "axios";
// const API_BASE_URL ='http://localhost:3000/api/users/'
const API_BASE_URL ='https://chat-backend-mw6l.onrender.com/api/users/'

// Create an Axios instance for default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true 
});

apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response.status === 401) {
      const res = await axios.get("/refresh", { withCredentials: true });
      localStorage.setItem("accessToken", res.data.accessToken);
      error.config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

// Common API methods
const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default apiService;
