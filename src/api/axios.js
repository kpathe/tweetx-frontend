import axios from "axios";
import conf from "../conf/conf";

const apiClient = axios.create({
  baseURL: conf.apiUrl,
  withCredentials: true,
  timeout: 1000, // Set a default timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_ACCESS_TOKEN",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired, redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
