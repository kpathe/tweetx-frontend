import axios from "axios";
import conf from "../conf/conf";

const apiClient = axios.create({
  baseURL: conf.apiUrl,
  withCredentials: true,
  // timeout: 1000, // Set a default timeout
});

// Add request interceptor to handle FormData properly
apiClient.interceptors.request.use(
  (config) => {
    // If the data is FormData, don't set Content-Type header
    // Let the browser/axios set it automatically with the boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
